// app/iclock/cdata/route.js
import { push } from '@/lib/log';

export async function GET(req) {
  const p = new URL(req.url).searchParams;
  const sn = p.get('SN') || p.get('sn') || '?';
  push('INIT', sn, `options=${p.get('options')} ip=${req.headers.get('x-forwarded-for')}`);

  const body = [
    `GET OPTION FROM: ${sn}`,
    `ATTLOGStamp=0`,
    `OPERLOGStamp=0`,
    `Realtime=1`,
    `Delay=10`,
    `ServerVer=3.0.1`,
    ``,
  ].join('\r\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}

export async function POST(req) {
  const p = new URL(req.url).searchParams;
  const sn = p.get('SN') || p.get('sn') || '?';
  const table = p.get('table') || '?';
  const body = await req.text();
  push('PUSH', sn, `table=${table} body=${body.slice(0, 120)}`);
  return new Response('OK', { headers: { 'Content-Type': 'text/plain' } });
}
