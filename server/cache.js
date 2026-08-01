const NodeCache = require('node-cache');

// TTL cache for metadata that's fine to go briefly stale (user id lookups,
// YouTube results). NOT used for Twitch live/offline detection anymore -
// that's driven by EventSub + the live controller's in-memory state.
const cache = new NodeCache({ checkperiod: 60, useClones: false });

// Separate, TTL-less "last known good" store: whatever the last successful
// API response was, kept around so routes can fall back to it instead of
// erroring out when an upstream call fails.
//
// Stores a shallow copy rather than the original reference: callers (e.g.
// the live controller) also keep their own reference to the same object for
// in-memory state. Without copying, an in-place mutation on one side would
// silently corrupt the other - copying here breaks that hazard for cheap,
// since these payloads are tiny (a handful of fields, or a 4-item array).
function shallowCopy(value) {
  if (Array.isArray(value)) return value.map((item) => (item && typeof item === 'object' ? { ...item } : item));
  if (value && typeof value === 'object') return { ...value };
  return value;
}

const lastGood = new Map();
cache.setLastGood = (key, value) => lastGood.set(key, shallowCopy(value));
cache.getLastGood = (key) => {
  const value = lastGood.get(key);
  return value === undefined ? value : shallowCopy(value);
};

module.exports = cache;
