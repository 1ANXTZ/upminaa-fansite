// Minimal Server-Sent Events hub.
// Lets the backend push "stream went live", "stream ended", or
// "new YouTube video" events to every connected browser tab instantly,
// without the frontend needing to poll or the page needing a refresh.

const HEARTBEAT_INTERVAL_MS = 30 * 1000;

const clients = new Set();

// Periodic heartbeat serves two purposes: (1) keeps the connection alive
// through reverse proxies/load balancers with idle-connection timeouts
// (many default to 60s, well under how long the stream could stay in one
// state), and (2) doubles as a sweep for dead sockets that never fired a
// 'close' event (e.g. a client's network dropped without a clean FIN) -
// without this, those would sit in the Set indefinitely, growing memory
// usage over time.
const heartbeatTimer = setInterval(() => {
  for (const client of clients) {
    try {
      client.write(': heartbeat\n\n');
    } catch (err) {
      clients.delete(client);
    }
  }
}, HEARTBEAT_INTERVAL_MS);
heartbeatTimer.unref?.();

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}

function broadcast(event, payload) {
  const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of clients) {
    try {
      client.write(message);
    } catch (err) {
      // Dead/broken socket that hasn't fired its 'close' event yet -
      // drop it here rather than letting a write error crash the poller.
      clients.delete(client);
    }
  }
}

function clientCount() {
  return clients.size;
}

// Actively ends every open SSE connection - used on graceful shutdown so
// the process doesn't have to wait on http.Server.close()'s keep-alive
// behavior (which otherwise only resolves once all sockets close on their
// own, and SSE sockets are intentionally long-lived).
function closeAll() {
  clearInterval(heartbeatTimer);
  for (const client of clients) {
    try {
      client.end();
    } catch (err) {
      // already closed/broken - nothing to do
    }
  }
  clients.clear();
}

module.exports = { addClient, removeClient, broadcast, clientCount, closeAll };
