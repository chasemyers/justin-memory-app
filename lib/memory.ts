import { supabase } from './supabase';
import { embed } from './openai';

export async function searchTopK(query: string, k = 12) {
  const vec = await embed(query);
  const { data, error } = await supabase.rpc('search_memories', { query_embedding: vec, match_count: k });
  if (error) throw error;
  return data;
}

export async function getStickySeed(): Promise<string> {
  const { data, error } = await supabase.from('memories').select('*').eq('sticky', true).order('created_at', { ascending: true });
  if (error) throw error;
  const lines = (data||[]).map((m:any)=>`${m.title}: ${m.body}`);
  return lines.join('\n');
}

export async function upsertMemories(entries: any[]) {
  for (const e of entries) {
    if (!e || !e.title || !e.body) continue;
    const text = `${e.type} | ${e.title} :: ${e.body}`;
    const vec = await embed(text);
    const { error } = await supabase.from('memories').insert({
      type: e.type || 'INSIGHT',
      title: e.title,
      body: e.body,
      importance: e.importance ?? 3,
      sticky: !!e.sticky,
      sensitive: !!e.sensitive,
      embedding: vec,
    });
    if (error) throw error;
  }
}

export async function getTopContext(userMessage: string, includeSticky = true) {
  const top = await searchTopK(userMessage, 10);
  let sticky = '';
  if (includeSticky) sticky = await getStickySeed();
  const bullets = (top||[]).map((m:any)=>`- [${m.type}] ${m.title}: ${m.body}`);
  const context = [
    sticky ? `Sticky:\n${sticky}` : '',
    bullets.length ? `Relevant:\n${bullets.join('\n')}` : '',
  ].filter(Boolean).join('\n\n');
  return context;
}
