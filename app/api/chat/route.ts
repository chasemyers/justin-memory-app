import { NextRequest, NextResponse } from 'next/server';
import { openai, OPENAI_MODEL } from '../../../lib/openai';
import { getTopContext } from '../../../lib/memory';
import { SYSTEM_PROMPT } from '../../../lib/prompts';

function passOk(req: NextRequest) {
  const want = process.env.APP_PASSWORD || '';
  const got = req.headers.get('x-app-pass') || '';
  return !want || want === got;
}

export async function POST(req: NextRequest) {
  if (!passOk(req)) return new NextResponse('Unauthorized', { status: 401 });
  const { message } = await req.json();
  if (!message) return new NextResponse('Missing message', { status: 400 });

  const memoryContext = await getTopContext(message, true);
  const userPrompt = `Memory Context:\n\n${memoryContext}\n\nUser: ${message}`;

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.3,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' }
  });

  const raw = completion.choices?.[0]?.message?.content || '{}';
  let parsed: any = { reply: '(no reply)', proposed: [] };
  try { parsed = JSON.parse(raw); } catch {}

  return NextResponse.json({
    reply: parsed.reply || '(empty)',
    proposed: Array.isArray(parsed.proposed) ? parsed.proposed : []
  });
}
