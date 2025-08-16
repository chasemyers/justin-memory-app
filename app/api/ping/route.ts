import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const want = process.env.APP_PASSWORD || '';
  const got = req.headers.get('x-app-pass') || '';
  if (want && got !== want) return new NextResponse('Nope', { status: 401 });
  return NextResponse.json({ ok: true, model: process.env.OPENAI_MODEL || 'gpt-4o' });
}
