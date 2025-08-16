import { NextRequest, NextResponse } from 'next/server';
import { upsertMemories } from '../../../../lib/memory';

export async function POST(req: NextRequest) {
  const { entries } = await req.json();
  if (!Array.isArray(entries)) return new NextResponse('entries[] required', { status: 400 });
  await upsertMemories(entries);
  return NextResponse.json({ ok: true });
}
