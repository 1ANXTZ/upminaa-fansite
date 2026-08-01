const config = require('../config');
const cache = require('../cache');
const twitchApi = require('./twitchApiClient');

const USER_ID_KEY = 'twitch:user_id';
const STATUS_LASTGOOD_KEY = 'twitch:status';
const VOD_LASTGOOD_KEY = 'twitch:vod';

async function getUserId() {
  const cached = cache.get(USER_ID_KEY);
  if (cached) return cached;

  const data = await twitchApi.get(`/users?login=${encodeURIComponent(config.twitch.channelLogin)}`);
  const user = data.data && data.data[0];
  if (!user) throw new Error(`Twitch user not found: ${config.twitch.channelLogin}`);

  cache.set(USER_ID_KEY, user.id, 3600);
  return user.id;
}

// Always hits Helix directly - callers (the live controller) decide when
// this is worth calling, so there's no TTL cache in the way here.
async function fetchStreamStatus() {
  const data = await twitchApi.get(`/streams?user_login=${encodeURIComponent(config.twitch.channelLogin)}`);
  const stream = data.data && data.data[0];

  const result = stream
    ? {
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewerCount: stream.viewer_count,
        startedAt: stream.started_at,
        thumbnailUrl: stream.thumbnail_url
          ? stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360')
          : null,
      }
    : { isLive: false };

  cache.setLastGood(STATUS_LASTGOOD_KEY, result);
  return result;
}

async function fetchLatestVod() {
  const userId = await getUserId();
  const data = await twitchApi.get(`/videos?user_id=${userId}&type=archive&first=1&sort=time`);
  const vod = data.data && data.data[0];

  const result = vod
    ? {
        id: vod.id,
        title: vod.title,
        url: vod.url,
        thumbnailUrl: vod.thumbnail_url
          ? vod.thumbnail_url.replace('%{width}', '640').replace('%{height}', '360')
          : null,
        createdAt: vod.created_at,
        duration: vod.duration,
      }
    : null;

  cache.setLastGood(VOD_LASTGOOD_KEY, result);
  return result;
}

function getLastGoodStatus() {
  return cache.getLastGood(STATUS_LASTGOOD_KEY) || { isLive: false };
}

function getLastGoodVod() {
  return cache.getLastGood(VOD_LASTGOOD_KEY) || null;
}

module.exports = { getUserId, fetchStreamStatus, fetchLatestVod, getLastGoodStatus, getLastGoodVod };
