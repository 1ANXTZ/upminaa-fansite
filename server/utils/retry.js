// Small retry helper with exponential backoff + jitter.
// `fn` receives the current attempt index (0 = first try) in case callers
// need attempt-aware behavior (e.g. only force a token refresh once).
async function withRetry(fn, options = {}) {
  const {
    retries = 3,
    baseDelayMs = 300,
    factor = 2,
    shouldRetry = (err) => err.retryable !== false,
    onRetry,
  } = options;

  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn(attempt);
    } catch (err) {
      const canRetry = attempt < retries && shouldRetry(err);
      if (!canRetry) throw err;

      const jitter = 0.75 + Math.random() * 0.5;
      const delay = baseDelayMs * Math.pow(factor, attempt) * jitter;
      if (onRetry) onRetry(err, attempt + 1, delay);

      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = { withRetry };
