const config = require('../config');
const cache = require('../cache');
const { withRetry } = require('../utils/retry');

const UPLOADS_PLAYLIST_KEY = 'youtube:uploads_playlist';
const LATEST_VIDEOS_KEY = 'youtube:latest';
const LATEST_VIDEOS_LASTGOOD_KEY = 'youtube:latest:lastgood';

async function fetchJson(url) {
  return withRetry(async () => {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err = new Error(`YouTube API error ${res.status}: ${body}`);
      err.retryable = res.status >= 500 || res.status === 429;
      throw err;
    }
    return res.json();
  }, {
    retries: 3,
    baseDelayMs: 400,
    onRetry: (err, attempt, delayMs) =>
      console.warn(`[youtube] request failed (attempt ${attempt}), retrying in ${Math.round(delayMs)}ms: ${err.message}`),
  });
}

// Converts ISO-8601 durations (e.g. "PT1H2M3S") into "1:02:03" / "2:03".
function formatDuration(iso) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  if (!match) return null;

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  const mm = hours ? String(minutes).padStart(2, '0') : String(minutes);
  const ss = String(seconds).padStart(2, '0');

  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

// channels.list (1 quota unit) instead of search.list (100 units) to
// resolve the "uploads" playlist, then playlistItems.list to page it.
async function getUploadsPlaylistId() {
  const cached = cache.get(UPLOADS_PLAYLIST_KEY);
  if (cached) return cached;

  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${config.youtube.channelId}&key=${config.youtube.apiKey}`;
  const data = await fetchJson(url);
  const channel = data.items && data.items[0];
  if (!channel) throw new Error('YouTube channel not found');

  const playlistId = channel.contentDetails.relatedPlaylists.uploads;
  cache.set(UPLOADS_PLAYLIST_KEY, playlistId, 86400);
  return playlistId;
}

async function fetchLatestVideos(limit) {
  const playlistId = await getUploadsPlaylistId();

  const listUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${limit}&key=${config.youtube.apiKey}`;
  const listData = await fetchJson(listUrl);
  const items = listData.items || [];

  const videoIds = items.map((item) => item.snippet.resourceId.videoId).filter(Boolean);

  let durations = {};
  if (videoIds.length) {
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${config.youtube.apiKey}`;
    const detailsData = await fetchJson(detailsUrl);
    durations = Object.fromEntries(
      (detailsData.items || []).map((v) => [v.id, formatDuration(v.contentDetails.duration)])
    );
  }

  return items.map((item) => {
    const id = item.snippet.resourceId.videoId;
    return {
      id,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${id}`,
      duration: durations[id] || null,
    };
  });
}

async function getLatestVideos(limit = 4) {
  const cached = cache.get(LATEST_VIDEOS_KEY);
  if (cached) return cached;

  try {
    const videos = await fetchLatestVideos(limit);
    cache.set(LATEST_VIDEOS_KEY, videos, config.cache.youtubeTtl);
    cache.setLastGood(LATEST_VIDEOS_LASTGOOD_KEY, videos);
    return videos;
  } catch (err) {
    const lastGood = cache.getLastGood(LATEST_VIDEOS_LASTGOOD_KEY);
    if (lastGood) {
      console.warn('[youtube] fetch failed, serving last known videos:', err.message);
      return lastGood;
    }
    throw err;
  }
}

module.exports = { getLatestVideos };
