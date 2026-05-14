import Ably from 'ably';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'ABLY_API_KEY not configured' }, { status: 500 });
  }
  const rest = new Ably.Rest(key);
  const token = await rest.auth.createTokenRequest({ capability: { '*': ['subscribe', 'publish', 'presence'] } });
  return NextResponse.json(token);
}
