// pages/index.js
import { useState, useEffect } from 'react';

const TYPE_COLOR = {
  INIT:      { bg: '#dbeafe', text: '#1d4ed8' },
  HEARTBEAT: { bg: '#dcfce7', text: '#15803d' },
  PUSH:      { bg: '#fef9c3', text: '#a16207' },
  OTHER:     { bg: '#f3f4f6', text: '#6b7280' },
};

export default function Home() {
  const [events, setEvents]   = useState([]);
  const [tick,   setTick]     = useState(0);
  const [origin, setOrigin]   = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    let prev = 0;
    const poll = async () => {
      try {
        const r = await fetch('/api/events');
        const data = await r.json();
        setEvents(data);
        if (data.length > prev && prev > 0) {
          // brief flash handled by CSS on first row
        }
        prev = data.length;
      } catch {}
      setTick(t => t + 1);
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, []);

  const connected = events.some(e => e.type === 'INIT' || e.type === 'HEARTBEAT');
  const sns = [...new Set(events.map(e => e.sn).filter(s => s !== '?'))];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>

      {/* ── header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 11, height: 11, borderRadius: '50%',
          background: connected ? '#16a34a' : '#d1d5db',
          transition: 'background 0.5s',
        }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>
          BioMax — connection test
        </h1>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>
          {connected ? `✓ device connected · SN: ${sns.join(', ')}` : 'waiting for device…'} · #{tick}
        </span>
      </div>

      {/* ── config card ── */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '16px 20px', marginBottom: 24, fontSize: 13,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 10, color: '#334155' }}>
          Configure on BioMax device
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {[
              ['Cloud server address', origin || '…'],
              ['Cloud server port', '443'],
              ['Registration endpoint', '/api/iclock/cdata  (GET)'],
              ['Punch upload endpoint', '/api/iclock/cdata  (POST  ?table=ATTLOG)'],
              ['Heartbeat endpoint',    '/api/iclock/control  (POST)'],
            ].map(([label, val]) => (
              <tr key={label}>
                <td style={{ color: '#64748b', padding: '4px 0', width: 220, verticalAlign: 'top' }}>{label}</td>
                <td style={{ padding: '4px 0' }}>
                  <code style={{
                    background: '#e0f2fe', color: '#0369a1',
                    padding: '1px 6px', borderRadius: 4, fontSize: 12,
                  }}>{val}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── event log ── */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>

        {/* table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 160px 80px 1fr',
          padding: '8px 16px', background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em',
        }}>
          <span>TYPE</span><span>DEVICE SN</span><span>TIME</span><span>DETAIL</span>
        </div>

        {events.length === 0 && (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            No events yet — power on your device and it will appear here
          </div>
        )}

        {events.map((e, i) => {
          const c = TYPE_COLOR[e.type] || TYPE_COLOR.OTHER;
          return (
            <div key={e.id} style={{
              display: 'grid', gridTemplateColumns: '90px 160px 80px 1fr',
              padding: '8px 16px', fontSize: 13,
              borderBottom: i < events.length - 1 ? '1px solid #f3f4f6' : 'none',
              background: i === 0 ? '#fffbeb' : 'white',
              transition: 'background 1.5s',
            }}>
              <span>
                <span style={{
                  background: c.bg, color: c.text,
                  padding: '2px 7px', borderRadius: 4,
                  fontSize: 11, fontWeight: 700,
                }}>{e.type}</span>
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#374151', alignSelf: 'center' }}>
                {e.sn}
              </span>
              <span style={{ color: '#9ca3af', fontSize: 11, alignSelf: 'center' }}>
                {new Date(e.time).toLocaleTimeString()}
              </span>
              <span style={{ color: '#4b5563', fontSize: 12, wordBreak: 'break-all', alignSelf: 'center' }}>
                {e.detail}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: '#d1d5db', textAlign: 'right' }}>
        auto-refresh every 2 s · in-memory · resets on cold start
      </div>
    </div>
  );
}
