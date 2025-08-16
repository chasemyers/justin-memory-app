'use client';
import React, { useEffect, useRef, useState } from 'react';
import LoginGate from '../components/LoginGate';

type Msg = { role: 'user'|'assistant'|'system', content: string };
type Proposed = { type: string; title: string; body: string; importance?: number; sticky?: boolean; sensitive?: boolean };

export default function Page() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [proposed, setProposed] = useState<Proposed[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  }, [msgs]);

  async function send() {
    const message = input.trim();
    if (!message) return;
    setMsgs(m => [...m, { role: 'user', content: message }]);
    setInput('');

const pass = (typeof window !== 'undefined' && localStorage.getItem('pw')) || '';

const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-App-Pass': pass },
  body: JSON.stringify({ message }),
});
    if (!res.ok) {
      const t = await res.text();
      setMsgs(m => [...m, { role: 'assistant', content: `Error: ${t}` }]);
      return;
    }
    const data = await res.json();
    setMsgs(m => [...m, { role: 'assistant', content: data.reply }]);
    setProposed(data.proposed || []);
  }

  async function saveAll() {
    if (!proposed.length) return;
    const res = await fetch('/api/memories/upsert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: proposed }),
    });
    if (!res.ok) {
      const t = await res.text();
      alert('Save failed: ' + t);
      return;
    }
    setProposed([]);
    alert('Saved to memory ✅');
  }

  return (
    <LoginGate>
      <div className="card">
        <div className="row">
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Say something..." />
        </div>
        <div className="row">
          <button onClick={send}>Send</button>
          <button onClick={()=>{ setMsgs([]); setProposed([]); }}>Clear</button>
        </div>
      </div>

      <div ref={boxRef} className="card" style={{maxHeight: 420, overflowY: 'auto'}}>
        {msgs.map((m,i)=>(
          <div key={i} className="message">
            <div className="small">{m.role.toUpperCase()}</div>
            <div>{m.content}</div>
            <hr style={{opacity:0.08}}/>
          </div>
        ))}
      </div>

      {proposed.length>0 && (
        <div className="card">
          <div className="row" style={{justifyContent:'space-between'}}>
            <strong>Proposed memory entries</strong>
            <button onClick={saveAll}>Save all</button>
          </div>
          {proposed.map((p,i)=>(
            <div key={i} className="message">
              <div className="tag">{p.type}</div> <strong>{p.title}</strong>
              <div className="small">{p.body}</div>
            </div>
          ))}
        </div>
      )}
    </LoginGate>
  );
}
