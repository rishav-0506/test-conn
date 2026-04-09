// pages/api/iclock/cdata.js
import { logEvent } from '../_log';

export default function handler(req, res) {
  const sn = req.query.SN || req.query.sn || '?';
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?';

  if (req.method === 'GET') {
    // ── Device registration ──────────────────────────────────────────────
    logEvent('INIT', sn, `options=${req.query.options || ''} ip=${ip}`);

    const body = [
      `GET OPTION FROM: ${sn}`,
      `ATTLOGStamp=0`,
      `OPERLOGStamp=0`,
      `ATTPHOTOStamp=0`,
      `Realtime=1`,
      `Delay=10`,
      `TransInterval=1`,
      `TransFlag=111111111111`,
      `ServerVer=3.0.1`,
      ``,
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(body);
  }

  if (req.method === 'POST') {
    // ── Punch / data upload ──────────────────────────────────────────────
    const table = req.query.table || '?';
    let body = '';

    if (typeof req.body === 'string') {
      body = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      body = req.body.toString('utf8');
    } else if (req.body) {
      body = JSON.stringify(req.body);
    }

    logEvent('PUSH', sn, `table=${table} | ${body.slice(0, 200)}`);

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('OK');
  }

  res.status(405).send('Method Not Allowed');
}

export const config = { api: { bodyParser: { type: '*/*' } } };
