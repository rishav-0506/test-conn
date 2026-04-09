// app/iclock/service/route.js
import { push } from '@/lib/log';

export async function POST(req) {
  const sn = new URL(req.url).searchParams.get('SN') || '?';
  push('HEARTBEAT', sn, `ip=${req.headers.get('x-forwarded-for')}`);
  return new Response('', { headers: { 'Content-Type': 'text/plain' } });
}

export async function GET(req) {
  const sn = new URL(req.url).searchParams.get('SN') || '?';
  push('HEARTBEAT', sn, `ip=${req.headers.get('x-forwarded-for')}`);
  return new Response('', { headers: { 'Content-Type': 'text/plain' } });
}
