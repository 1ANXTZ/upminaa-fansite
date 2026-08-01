const config = require('../config');
const twitchApi = require('./twitchApiClient');

const WATCHED_TYPES = ['stream.online', 'stream.offline'];

// Twitch paginates this endpoint (default page size ~100) - walk the
// cursor fully so we never miss an existing subscription on accounts that
// have others configured elsewhere.
async function listSubscriptions() {
  let subscriptions = [];
  let cursor;

  do {
    const query = cursor ? `?after=${encodeURIComponent(cursor)}` : '';
    const data = await twitchApi.get(`/eventsub/subscriptions${query}`);
    subscriptions = subscriptions.concat(data.data || []);
    cursor = data.pagination && data.pagination.cursor;
  } while (cursor);

  return subscriptions;
}

async function createSubscription(type, condition) {
  try {
    const data = await twitchApi.post('/eventsub/subscriptions', {
      type,
      version: '1',
      condition,
      transport: {
        method: 'webhook',
        callback: `${config.publicBaseUrl}/api/twitch/eventsub`,
        secret: config.twitch.eventSubSecret,
      },
    });
    return data.data && data.data[0];
  } catch (err) {
    // 409 = an equivalent subscription already exists - not an error for us.
    if (err.status === 409) return null;
    throw err;
  }
}

async function deleteSubscription(id) {
  await twitchApi.del(`/eventsub/subscriptions?id=${id}`);
}

// Verifies our stream.online/offline subscriptions exist and are enabled;
// creates any that are missing and cleans up stale/broken ones. Safe to
// call repeatedly (idempotent) - this is what "renewal" means for webhook
// subscriptions, since they don't expire on a fixed timer like OAuth tokens,
// but Twitch can revoke them (auth changes, moderation, prolonged failures).
async function ensureSubscriptions(broadcasterUserId) {
  const existing = await listSubscriptions();

  for (const type of WATCHED_TYPES) {
    const alreadyEnabled = existing.some(
      (s) => s.type === type && s.condition.broadcaster_user_id === broadcasterUserId && s.status === 'enabled'
    );
    if (!alreadyEnabled) {
      await createSubscription(type, { broadcaster_user_id: broadcasterUserId });
    }
  }

  // Clean up anything left in a dead-end state (failed verification,
  // revoked, etc.) for this broadcaster so the subscription list stays tidy
  // and doesn't silently accumulate cruft over time.
  const stale = existing.filter(
    (s) =>
      s.condition.broadcaster_user_id === broadcasterUserId &&
      WATCHED_TYPES.includes(s.type) &&
      s.status !== 'enabled' &&
      s.status !== 'webhook_callback_verification_pending'
  );
  await Promise.all(
    stale.map((s) =>
      deleteSubscription(s.id).catch((err) =>
        console.warn(`[twitch] failed to delete stale EventSub subscription ${s.id}:`, err.message)
      )
    )
  );
}

module.exports = { ensureSubscriptions };
