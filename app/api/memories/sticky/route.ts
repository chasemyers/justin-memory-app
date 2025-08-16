import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export async function GET() {
  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  const { data } = await supabase.from('memories').select('*').eq('sticky', true).order('created_at', { ascending: true });
  const lines = (data||[]).map((m:any)=>`${m.title}: ${m.body}`);
  return NextResponse.json({ seed: lines.join('\n'), model });
}

export async function POST(req: NextRequest) {
  const { seed } = await req.json();
  if (typeof seed !== 'string') return new NextResponse('seed string required', { status: 400 });
  await supabase.from('memories').delete().eq('sticky', true);
  const lines = seed.split(/\n+/).map(s=>s.trim()).filter(Boolean);
  for (const line of lines) {
    const [title, ...rest] = line.split(':');
    const body = rest.join(':').trim();
    await supabase.from('memories').insert({ type: 'FACT', title: title.trim(), body, sticky: true, importance: 5 });
  }
  return NextResponse.json({ ok: true });
}
