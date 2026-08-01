const crypto = require('crypto');

// Per Twitch EventSub docs: signature = "sha256=" + HMAC-SHA256(secret, messageId + timestamp + rawBody)
// https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#verifying-the-notification
function verifyTwitchSignature({ messageId, timestamp, body, signature, secret }) {
  if (!messageId || !timestamp || !signature || !secret) return false;

  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(messageId + timestamp + body)
    .digest('hex');

  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);

  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

module.exports = { verifyTwitchSignature };
