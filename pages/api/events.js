// pages/api/events.js
import { getEvents } from './_log';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(getEvents());
}
