import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { searchTopK } from '../../../../lib/memory';

export async function POST(req: NextRequest) {
  const { q, stickyOnly } = await req.json();
  if (stickyOnly) {
    const { data, error } = await supabase.from('memories').select('*').eq('sticky', true).order('created_at', { ascending: false }).limit(200);
    if (error) return new NextResponse(error.message, { status: 400 });
    return NextResponse.json({ items: data });
  }
  if (!q || !q.trim()) {
    const { data, error } = await supabase.from('memories').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) return new NextResponse(error.message, { status: 400 });
    return NextResponse.json({ items: data });
  }
  const items = await searchTopK(q, 25);
  return NextResponse.json({ items });
}
