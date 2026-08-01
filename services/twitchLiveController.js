const config = require('../config');
const sse = require('../sse');
const twitchMetadata = require('./twitchMetadataService');
const twitchEventSub = require('./twitchEventSubService');

const state = {
  mode: 'initializing', // 'eventsub' | 'polling' | 'initializing'
  isLive: false,
  status: { isLive: false },
  vod: null,
};

let liveMetadataTimer = null;
let backupPollTimer = null;
let primaryPollTimer = null;
let reconcileTimer = null;

// Mutex around refreshStatus(): EventSub notifications, the backup poll,
// and the live-metadata-refresh loop can all fire close together. Without
// this, two concurrent Helix calls could resolve out of order and let a
// stale response overwrite a fresher one. Concurrent callers just await
// the single in-flight refresh instead of starting their own.
let inFlightRefresh = null;

function getStatus() {
  return state.status;
}

function getVod() {
  return state.vod;
}

function getMode() {
  return state.mode;
}

async function bootstrap() {
  // Seed from whatever we last knew, so the API never has a blank moment on boot.
  state.status = twitchMetadata.getLastGoodStatus();
  state.isLive = !!state.status.isLive;
  state.vod = twitchMetadata.getLastGoodVod();

  if (!config.publicBaseUrl || !config.twitch.eventSubSecret) {
    console.warn('[twitch] PUBLIC_BASE_URL or TWITCH_EVENTSUB_SECRET not set - running in polling-only mode.');
    return startPollingOnlyMode();
  }

  if (!config.publicBaseUrl.startsWith('https://')) {
    console.warn('[twitch] PUBLIC_BASE_URL must be https:// for Twitch to deliver EventSub webhooks - running in polling-only mode.');
    return startPollingOnlyMode();
  }

  try {
    const userId = await twitchMetadata.getUserId();
    await twitchEventSub.ensureSubscriptions(userId);
    await startEventSubMode();
  } catch (err) {
    console.error('[twitch] EventSub setup failed, falling back to polling-only mode:', err.message);
    await startPollingOnlyMode();
  }
}

async function startEventSubMode() {
  state.mode = 'eventsub';
  await seedInitialData();
  scheduleReconciliation();
  scheduleBackupPoll();
}

async function startPollingOnlyMode() {
  state.mode = 'polling';
  await seedInitialData();
  schedulePrimaryPoll();
}

async function seedInitialData() {
  // Covers the case where we booted mid-stream, or already offline with a
  // VOD we haven't cached yet.
  await refreshStatus();
  if (!state.isLive) {
    await refreshVod();
  }
}

function scheduleReconciliation() {
  clearInterval(reconcileTimer);
  reconcileTimer = setInterval(async () => {
    try {
      const userId = await twitchMetadata.getUserId();
      await twitchEventSub.ensureSubscriptions(userId);
    } catch (err) {
      console.error('[twitch] EventSub reconciliation failed:', err.message);
    }
  }, config.twitch.eventSubReconcileMs);
  // Don't let this interval keep the process alive on its own during shutdown.
  reconcileTimer.unref?.();
}

function scheduleBackupPoll() {
  clearInterval(backupPollTimer);
  // Long interval: only exists to correct drift if a webhook delivery is
  // ever missed. Not the primary detection mechanism.
  backupPollTimer = setInterval(() => refreshStatus(), config.twitch.backupPollIntervalMs);
  backupPollTimer.unref?.();
}

function schedulePrimaryPoll() {
  clearInterval(primaryPollTimer);
  primaryPollTimer = setInterval(() => refreshStatus(), config.twitch.pollingOnlyIntervalMs);
  primaryPollTimer.unref?.();
}

// Called by the EventSub webhook route when a notification arrives.
async function handleEventSubNotification(payload) {
  const type = payload.subscription && payload.subscription.type;

  if (type === 'stream.online') {
    await refreshStatus();
  } else if (type === 'stream.offline') {
    // applyStatus() already triggers a VOD refresh internally, but only on
    // an actual live->offline transition (wasLive check) - so a redundant
    // or redelivered offline notification while already offline won't
    // fire a second unnecessary Helix call.
    applyStatus({ isLive: false }, { forceBroadcast: true });
  }
}

// Called when Twitch revokes a subscription (auth changes, user removed
// the app, etc). We don't need to react beyond logging - the next
// reconciliation tick notices it's gone and recreates it automatically.
function handleEventSubRevocation(subscription) {
  console.warn(
    `[twitch] EventSub subscription revoked: type=${subscription?.type} status=${subscription?.status}`
  );
}

// Single entry point for fetching + applying fresh status. Mutex-guarded
// (see `inFlightRefresh` above) so overlapping triggers share one call.
async function refreshStatus({ forceBroadcast = false } = {}) {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = (async () => {
    try {
      const status = await twitchMetadata.fetchStreamStatus();
      applyStatus(status, { forceBroadcast: forceBroadcast || status.isLive !== state.isLive });
    } catch (err) {
      console.error('[twitch] status refresh failed, continuing to serve last known state:', err.message);
      // Deliberately not touching state.status here - graceful degradation.
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}

let inFlightVodRefresh = null;

async function refreshVod() {
  if (inFlightVodRefresh) return inFlightVodRefresh;

  inFlightVodRefresh = (async () => {
    try {
      const vod = await twitchMetadata.fetchLatestVod();
      state.vod = vod;
      sse.broadcast('twitch-vod', vod || {});
    } catch (err) {
      console.error('[twitch] VOD refresh failed, continuing to serve last known VOD:', err.message);
    } finally {
      inFlightVodRefresh = null;
    }
  })();

  return inFlightVodRefresh;
}

function applyStatus(status, { forceBroadcast = false } = {}) {
  const wasLive = state.isLive;
  state.isLive = !!status.isLive;
  state.status = status;

  if (forceBroadcast || wasLive !== state.isLive) {
    sse.broadcast('twitch-status', status);
  }

  if (state.isLive) {
    ensureLiveMetadataRefreshLoop();
  } else {
    stopLiveMetadataRefreshLoop();
    if (wasLive) refreshVod(); // stream just ended - grab the fresh VOD once
  }
}

// While live, EventSub itself doesn't carry viewer count/title changes, so
// refresh metadata on a moderate interval to keep them current. Routed
// through refreshStatus() so it shares the same mutex/apply path as
// everything else - no separate fetch-and-apply logic to duplicate or
// race against.
function ensureLiveMetadataRefreshLoop() {
  if (liveMetadataTimer) return;
  liveMetadataTimer = setInterval(() => {
    refreshStatus({ forceBroadcast: true });
  }, config.twitch.liveMetadataRefreshMs);
  liveMetadataTimer.unref?.();
}

function stopLiveMetadataRefreshLoop() {
  clearInterval(liveMetadataTimer);
  liveMetadataTimer = null;
}

function shutdown() {
  clearInterval(liveMetadataTimer);
  clearInterval(backupPollTimer);
  clearInterval(primaryPollTimer);
  clearInterval(reconcileTimer);
}

module.exports = {
  bootstrap,
  getStatus,
  getVod,
  getMode,
  handleEventSubNotification,
  handleEventSubRevocation,
  shutdown,
};
