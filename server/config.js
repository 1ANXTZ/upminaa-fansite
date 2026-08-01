require('dotenv').config();

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.warn(`[config] Missing environment variable: ${name}`);
  }
  return value;
}

// Parses a numeric env var with a floor. A malformed value (typo, empty
// string, non-numeric) silently becoming NaN/0 would turn setInterval into
// an effectively-immediate, infinitely repeating loop - a real way to burn
// through a rate limit or run up API costs from a config typo. Falling back
// to the default and clamping to a sane minimum prevents that class of
// incident entirely.
function parseIntervalMs(envValue, defaultMs, minMs) {
  const parsed = Number(envValue);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultMs;
  return Math.max(parsed, minMs);
}

const eventSubSecret = process.env.TWITCH_EVENTSUB_SECRET;
if (eventSubSecret && (eventSubSecret.length < 10 || eventSubSecret.length > 100)) {
  console.warn('[config] TWITCH_EVENTSUB_SECRET should be 10-100 characters per Twitch requirements.');
}

const allowedOrigins = (process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  port: Number(process.env.PORT || 3000) || 3000,

  // Supports a single origin, "*", or a comma-separated list
  // (e.g. "https://site.com,https://staging.site.com").
  allowedOrigin: allowedOrigins.includes('*') ? '*' : allowedOrigins,

  // Set to true when running behind a reverse proxy/CDN (Heroku, Render,
  // nginx, etc.) so Express reads X-Forwarded-* for req.ip and req.secure.
  trustProxy: process.env.TRUST_PROXY === 'true',

  // Public HTTPS URL Twitch can reach to deliver EventSub notifications
  // (e.g. https://fanhub.example.com). Leave unset to force polling-only mode.
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, ''),

  // Max concurrent SSE connections before new ones are refused with 503 -
  // a cheap guard against unbounded memory/file-descriptor growth.
  sseMaxClients: Number(process.env.SSE_MAX_CLIENTS || 5000),

  twitch: {
    clientId: requiredEnv('TWITCH_CLIENT_ID'),
    clientSecret: requiredEnv('TWITCH_CLIENT_SECRET'),
    channelLogin: process.env.TWITCH_CHANNEL_LOGIN || 'upminaa',

    // Shared secret used to sign/verify EventSub webhook payloads (10-100 chars)
    eventSubSecret,

    // How often to re-verify our EventSub subscriptions are still enabled
    // and recreate them if Twitch revoked/dropped one.
    eventSubReconcileMs: parseIntervalMs(process.env.TWITCH_EVENTSUB_RECONCILE_MS, 30 * 60 * 1000, 60_000),

    // Safety-net poll while EventSub is the primary mechanism - only
    // corrects drift if a webhook delivery was somehow missed.
    backupPollIntervalMs: parseIntervalMs(process.env.TWITCH_BACKUP_POLL_INTERVAL_MS, 10 * 60 * 1000, 60_000),

    // Primary poll interval used ONLY when EventSub can't be set up at all.
    pollingOnlyIntervalMs: parseIntervalMs(process.env.TWITCH_POLLING_ONLY_INTERVAL_MS, 30 * 1000, 10_000),

    // While live, viewer count/title aren't pushed by EventSub itself, so
    // refresh metadata on this interval to keep them current.
    liveMetadataRefreshMs: parseIntervalMs(process.env.TWITCH_LIVE_METADATA_REFRESH_MS, 60 * 1000, 15_000),
  },

  youtube: {
    apiKey: requiredEnv('YOUTUBE_API_KEY'),
    channelId: process.env.YOUTUBE_CHANNEL_ID || 'UCw3CBMvVjZJNfQR3tEvTodQ',
  },

  cache: {
    // YouTube has no push API, so this cache backs normal interval polling.
    youtubeTtl: Number(process.env.YOUTUBE_TTL_SECONDS || 900) || 900,
  },

  poll: {
    youtubeIntervalMs: parseIntervalMs(process.env.YOUTUBE_POLL_INTERVAL_MS, 600000, 60_000),
  },
};
