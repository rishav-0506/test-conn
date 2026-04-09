// app/api/log/route.js
import { all } from '@/lib/log';
export async function GET() {
  return Response.json(all());
}
