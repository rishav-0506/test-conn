// pages/api/iclock/control.js
import { logEvent } from '../_log';

export default function handler(req, res) {
  const sn = req.query.SN || req.query.sn || '?';
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?';

  logEvent('HEARTBEAT', sn, `ip=${ip}`);

  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send('');
}

export const config = { api: { bodyParser: false } };
