const express = require('express');
const router = express.Router();

const config = require('../config');
const youtubeService = require('../services/youtubeService');
const twitchLiveController = require('../services/twitchLiveController');
const sse = require('../sse');

// GET /api/twitch/status -> served straight from in-memory state kept by
// the live controller (updated via EventSub / polling fallback). No Helix
// call happens per request - this is intentional, to minimize API usage.
router.get('/twitch/status', (req, res) => {
  res.json(twitchLiveController.getStatus());
});

// GET /api/twitch/vod -> same idea: last known VOD, refreshed by the
// controller whenever the stream goes offline (or on reconciliation).
router.get('/twitch/vod', (req, res) => {
  res.json(twitchLiveController.getVod() || {});
});

// GET /api/youtube/videos -> cached/backed-off fetch; never hard-fails to
// the client, falls back to an empty list if even the last-known-good
// value is unavailable (e.g. very first boot with no cache yet).
router.get('/youtube/videos', async (req, res) => {
  try {
    const videos = await youtubeService.getLatestVideos(4);
    res.json(videos);
  } catch (err) {
    console.error('[api] youtube videos unavailable:', err.message);
    res.json([]);
  }
});

// GET /api/health -> lightweight diagnostics (not part of the public
// frontend contract, useful for uptime checks / debugging deployments)
router.get('/health', (req, res) => {
  res.json({
    twitchMode: twitchLiveController.getMode(),
    twitchIsLive: !!twitchLiveController.getStatus().isLive,
  });
});

// GET /api/events -> Server-Sent Events stream for real-time UI updates
router.get('/events', (req, res) => {
  if (sse.clientCount() >= config.sseMaxClients) {
    res.status(503).json({ error: 'Too many active connections, please retry shortly.' });
    return;
  }

  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    // Some reverse proxies (nginx) buffer streamed responses by default,
    // which defeats real-time delivery - this header opts back out.
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write('retry: 5000\n\n');

  sse.addClient(res);
  req.on('close', () => sse.removeClient(res));
});

module.exports = router;
