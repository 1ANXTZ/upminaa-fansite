const express = require('express');
const router = express.Router();

const config = require('../config');
const cache = require('../cache');
const { verifyTwitchSignature } = require('../utils/signature');
const twitchLiveController = require('../services/twitchLiveController');

const MESSAGE_TYPE = {
  VERIFICATION: 'webhook_callback_verification',
  NOTIFICATION: 'notification',
  REVOCATION: 'revocation',
};

// How old a signed message is allowed to be before we reject it as a
// possible replay, independent of the message-id dedupe cache below.
const MAX_MESSAGE_AGE_MS = 10 * 60 * 1000;

// Needs the raw request body to verify Twitch's HMAC signature, so this
// route parses raw bytes itself rather than relying on a shared JSON parser.
router.post('/eventsub', express.raw({ type: 'application/json', limit: '64kb' }), (req, res) => {
  const messageId = req.header('Twitch-Eventsub-Message-Id');
  const timestamp = req.header('Twitch-Eventsub-Message-Timestamp');
  const signature = req.header('Twitch-Eventsub-Message-Signature');
  const messageType = req.header('Twitch-Eventsub-Message-Type');
  const rawBody = req.body ? req.body.toString('utf8') : '';

  const isValid = verifyTwitchSignature({
    messageId,
    timestamp,
    body: rawBody,
    signature,
    secret: config.twitch.eventSubSecret,
  });

  if (!isValid) {
    console.warn('[eventsub] rejected notification with invalid signature');
    return res.status(403).send('invalid signature');
  }

  // Defense-in-depth: reject stale signed payloads even though the HMAC is
  // valid, in case a message were ever captured and replayed later.
  const messageAgeMs = Date.now() - new Date(timestamp).getTime();
  if (!Number.isFinite(messageAgeMs) || messageAgeMs > MAX_MESSAGE_AGE_MS || messageAgeMs < -60_000) {
    console.warn('[eventsub] rejected notification with stale/invalid timestamp');
    return res.status(403).send('stale timestamp');
  }

  // Twitch retries deliveries at-least-once; de-dupe by message id so a
  // retried delivery (or a captured-and-replayed one within the window
  // above) is never processed twice.
  const dedupeKey = `eventsub:msg:${messageId}`;
  if (cache.get(dedupeKey)) {
    return res.status(200).send('duplicate');
  }
  cache.set(dedupeKey, true, 600);

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).send('invalid json');
  }

  if (messageType === MESSAGE_TYPE.VERIFICATION) {
    return res.status(200).type('text/plain').send(payload.challenge);
  }

  if (messageType === MESSAGE_TYPE.REVOCATION) {
    twitchLiveController.handleEventSubRevocation(payload.subscription);
    return res.status(200).send('ok');
  }

  if (messageType === MESSAGE_TYPE.NOTIFICATION) {
    // Ack immediately (Twitch expects a fast 200), then process.
    res.status(200).send('ok');
    setImmediate(() => {
      twitchLiveController.handleEventSubNotification(payload).catch((err) => {
        console.error('[eventsub] notification handling failed:', err.message);
      });
    });
    return;
  }

  res.status(200).send('ignored');
});

module.exports = router;
