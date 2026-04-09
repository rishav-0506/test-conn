'use client';
import { useState, useEffect } from 'react';

const COLORS = { INIT: '#3b82f6', HEARTBEAT: '#10b981', PUSH: '#f59e0b', UNKNOWN: '#6b7280' };
const HOST = typeof location !== 'undefined' ? location.origin : '';

export default function Page() {
  const [log, setLog] = useState([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const poll = async () => {
      const r = await fetch('/api/log').catch(() => null);
      if (r?.ok) setLog(await r.json());
      setTick(t => t + 1);
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, []);

  const hasDevice = log.some(e => e.type === 'INIT' || e.type === 'HEARTBEAT');

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', maxWidth: 780, margin: '0 auto', padding: 28 }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: hasDevice ? '#10b981' : '#d1d5db',
          boxShadow: hasDevice ? '0 0 0 3px #bbf7d0' : 'none',
        }} />
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          BioMax connection test
        </h1>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>
          {hasDevice ? '✓ device seen' : 'waiting for device…'} · poll #{tick}
        </span>
      </div>

      {/* config box */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
        padding: '16px 20px', marginBottom: 24, fontSize: 13, lineHeight: 2,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Set on your BioMax device:</div>
        <div><span style={{ color: '#64748b', width: 140, display: 'inline-block' }}>Cloud server:</span>
          <code style={{ background: '#e0f2fe', padding: '1px 6px', borderRadius: 4 }}>{HOST}</code></div>
        <div><span style={{ color: '#64748b', width: 140, display: 'inline-block' }}>Port:</span>
          <code style={{ background: '#e0f2fe', padding: '1px 6px', borderRadius: 4 }}>443</code></div>
        <div style={{ marginTop: 8, color: '#64748b', fontSize: 12 }}>
          Endpoints: &nbsp;
          <code>GET /iclock/cdata</code> &nbsp;·&nbsp;
          <code>POST /iclock/cdata</code> &nbsp;·&nbsp;
          <code>POST /iclock/service/control</code>
        </div>
      </div>

      {/* event log */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
          fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'flex', gap: 24,
        }}>
          <span style={{ width: 80 }}>TYPE</span>
          <span style={{ width: 160 }}>DEVICE SN</span>
          <span style={{ width: 100 }}>TIME</span>
          <span>DETAIL</span>
        </div>

        {log.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            No events yet — configure the device and it will appear here
          </div>
        )}

        {log.map((e, i) => (
          <div key={i} style={{
            display: 'flex', gap: 24, padding: '9px 16px', fontSize: 13,
            borderBottom: i < log.length - 1 ? '1px solid #f3f4f6' : 'none',
            background: i === 0 ? '#fefce8' : 'white',
          }}>
            <span style={{
              width: 80, fontWeight: 700, fontSize: 11,
              color: COLORS[e.type] ?? '#6b7280',
            }}>{e.type}</span>
            <span style={{ width: 160, fontFamily: 'monospace', fontSize: 12 }}>{e.sn}</span>
            <span style={{ width: 100, color: '#9ca3af', fontSize: 11 }}>
              {new Date(e.t).toLocaleTimeString()}
            </span>
            <span style={{ color: '#4b5563', fontSize: 12, wordBreak: 'break-all' }}>{e.detail}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: '#d1d5db', textAlign: 'right' }}>
        auto-refresh every 2 s · in-memory only · resets on redeploy
      </div>
    </div>
  );
}
