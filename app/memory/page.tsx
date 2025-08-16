'use client';
import React, { useEffect, useState } from 'react';
import LoginGate from '../../components/LoginGate';

type Mem = { id: string; type: string; title: string; body: string; created_at: string; sticky: boolean; importance: number };

export default function MemoryPage() {
  const [items, setItems] = useState<Mem[]>([]);
  const [q, setQ] = useState('');
  const [stickyOnly, setStickyOnly] = useState(false);

  async function runSearch() {
const pass = (typeof window !== 'undefined' && localStorage.getItem('pw')) || '';
const res = await fetch('/api/memories/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-App-Pass': pass },
  body: JSON.stringify({ q, stickyOnly })
});
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => { runSearch(); }, []);

  return (
    <LoginGate>
      <div className="card">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search memories..." />
        <div className="row" style={{marginTop:8}}>
          <label><input type="checkbox" checked={stickyOnly} onChange={e=>setStickyOnly(e.target.checked)} /> Sticky only</label>
          <button onClick={runSearch}>Search</button>
        </div>
      </div>
      <div className="card">
        <strong>Results</strong>
        {items.map(it=>(
          <div key={it.id} className="message">
            <div className="tag">{it.type}</div> <strong>{it.title}</strong> <span className="small">({new Date(it.created_at).toLocaleString()})</span>
            <div className="small">{it.body}</div>
            {it.sticky && <span className="tag">STICKY</span>}
          </div>
        ))}
      </div>
    </LoginGate>
  );
}
