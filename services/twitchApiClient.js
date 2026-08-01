const config = require('../config');
const cache = require('../cache');
const { withRetry } = require('../utils/retry');

const TOKEN_CACHE_KEY = 'twitch:app_token';

async function fetchAppAccessToken(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = cache.get(TOKEN_CACHE_KEY);
    if (cached) return cached;
  }

  const params = new URLSearchParams({
    client_id: config.twitch.clientId,
    client_secret: config.twitch.clientSecret,
    grant_type: 'client_credentials',
  });

  const res = await fetch(`https://id.twitch.tv/oauth2/token?${params.toString()}`, { method: 'POST' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Twitch token error ${res.status}: ${body}`);
  }

  const data = await res.json();
  // Refresh a bit before actual expiry so we never serve a token that's about to die
  const ttl = Math.max(60, data.expires_in - 120);
  cache.set(TOKEN_CACHE_KEY, data.access_token, ttl);
  return data.access_token;
}

async function helixRequest(method, path, body) {
  return withRetry(
    async (attempt) => {
      const token = await fetchAppAccessToken(false);

      const res = await fetch(`https://api.twitch.tv/helix${path}`, {
        method,
        headers: {
          'Client-Id': config.twitch.clientId,
          Authorization: `Bearer ${token}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 401 && attempt === 0) {
        // Token may have been revoked/expired early - force one refresh and retry once.
        await fetchAppAccessToken(true);
        throw Object.assign(new Error('Twitch token invalid, refreshed and retrying'), { retryable: true });
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`Twitch API error ${res.status}: ${text}`);
        err.status = res.status;
        // Only transient failures are worth retrying automatically.
        err.retryable = res.status >= 500 || res.status === 429;
        throw err;
      }

      if (res.status === 204) return {};
      return res.json();
    },
    {
      retries: 3,
      baseDelayMs: 400,
      onRetry: (err, attempt, delayMs) =>
        console.warn(`[twitch] ${method} ${path} failed (attempt ${attempt}), retrying in ${Math.round(delayMs)}ms: ${err.message}`),
    }
  );
}

module.exports = {
  get: (path) => helixRequest('GET', path),
  post: (path, body) => helixRequest('POST', path, body),
  del: (path) => helixRequest('DELETE', path),
};
