// lib/log.js
const g = globalThis.__biomaxLog ?? { events: [] };
if (!globalThis.__biomaxLog) globalThis.__biomaxLog = g;

export function push(type, sn, detail) {
  g.events.unshift({
    t: new Date().toISOString(),
    type,   // INIT | HEARTBEAT | PUSH | UNKNOWN
    sn: sn || '?',
    detail,
  });
  if (g.events.length > 50) g.events.length = 50;
}

export function all() { return g.events; }
