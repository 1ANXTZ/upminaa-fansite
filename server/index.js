const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const apiRoutes = require('./routes/api');
const twitchWebhookRoutes = require('./routes/twitchWebhook');
const sse = require('./sse');
const twitchLiveController = require('./services/twitchLiveController');
const youtubeService = require('./services/youtubeService');

const app = express();

if (config.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(helmet({ contentSecurityPolicy: false }));

// EventSub webhook is server-to-server (Twitch -> us), authenticated via
// HMAC signature rather than CORS/browser trust, so it's mounted before -
// and deliberately outside of - the CORS/rate-limit middleware below. That
// also means a burst of legitimate Twitch deliveries can never get
// throttled by the same limiter protecting the public browser-facing API.
// It also needs the raw body for signature verification, so it parses its
// own body rather than relying on a shared JSON parser.
app.use('/api/twitch', twitchWebhookRoutes);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', cors({ origin: config.allowedOrigin }), apiLimiter, apiRoutes);

// Serve the existing static frontend as-is (index.html / style.css / main.js / assets)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Central error handler: never leak stack traces / upstream keys to clients
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[api error]', err.message);
  res.status(502).json({ error: 'Upstream service unavailable, please retry shortly.' });
});

const server = app.listen(config.port, () => {
  console.log(`Upminaa Fan Hub backend running on port ${config.port}`);
});

/* =========================================================
   TWITCH: EventSub-first live detection.
   See services/twitchLiveController.js for the full state machine
   (EventSub notifications -> Helix metadata fetch -> SSE broadcast,
   with polling used only as a backup/fallback mechanism).
   ========================================================= */
twitchLiveController.bootstrap().catch((err) => {
  console.error('[twitch] bootstrap failed unexpectedly:', err.message);
});

/* =========================================================
   YOUTUBE: no push API available, so poll on an interval and only
   broadcast when the newest video actually changes.
   ========================================================= */
let lastVideoId = null;
let youtubePollTimer = null;

async function pollYoutube() {
  try {
    const videos = await youtubeService.getLatestVideos(4);
    if (videos[0] && videos[0].id !== lastVideoId) {
      lastVideoId = videos[0].id;
      sse.broadcast('youtube-videos', videos);
    }
  } catch (err) {
    console.error('[poll:youtube]', err.message);
  }
}

pollYoutube();
youtubePollTimer = setInterval(pollYoutube, config.poll.youtubeIntervalMs);
youtubePollTimer.unref?.();

/* =========================================================
   GRACEFUL SHUTDOWN
   Stops accepting new connections, clears all background timers, and
   exits cleanly instead of leaving dangling intervals/sockets - important
   for container orchestrators that send SIGTERM on redeploy/scale-down.
   ========================================================= */
function shutdown(signal) {
  console.log(`[server] received ${signal}, shutting down...`);
  clearInterval(youtubePollTimer);
  twitchLiveController.shutdown();
  sse.closeAll();
  server.close(() => {
    console.log('[server] closed cleanly');
    process.exit(0);
  });
  // Force-exit if close() hangs (e.g. long-lived SSE connections not closing)
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
