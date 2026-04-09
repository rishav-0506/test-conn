// pages/api/_log.js
// Self-contained in-memory event log.
// Stored on globalThis so it survives hot-reloads in dev.

if (!globalThis._biomaxEvents) globalThis._biomaxEvents = [];

const MAX = 100;

export function logEvent(type, sn, detail) {
  globalThis._biomaxEvents.unshift({
    id: Date.now() + Math.random().toString(36).slice(2, 6),
    time: new Date().toISOString(),
    type,      // INIT | HEARTBEAT | PUSH | OTHER
    sn: sn || '?',
    detail: String(detail || ''),
  });
  if (globalThis._biomaxEvents.length > MAX) {
    globalThis._biomaxEvents.length = MAX;
  }
}

export function getEvents() {
  return globalThis._biomaxEvents;
}
