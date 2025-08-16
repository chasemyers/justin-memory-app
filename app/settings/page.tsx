'use client';
import React, { useEffect, useState } from 'react';
import LoginGate from '../../components/LoginGate';

export default function SettingsPage() {
  const [model, setModel] = useState('');
  const [stickyText, setStickyText] = useState('Name: Justin\nPets: Molly (dog), Rex (dog), Link (cat)\nTone: Direct, honest, practical\nFaith: Bold Christian, not watered-down');

useEffect(()=>{
  const pass = (typeof window !== 'undefined' && localStorage.getItem('pw')) || '';
  fetch('/api/memories/sticky', { headers: { 'X-App-Pass': pass }})
    .then(r=>r.json()).then(d=>{
      setStickyText(d.seed || stickyText);
      setModel(d.model || '');
    });
},[]);
  
const pass = (typeof window !== 'undefined' && localStorage.getItem('pw')) || '';
const res = await fetch('/api/memories/sticky', {
  method: 'POST',
  headers: { 'Content-Type':'application/json', 'X-App-Pass': pass },
  body: JSON.stringify({ seed: stickyText })
});
  
  return (
    <LoginGate>
      <div className="card">
        <h3>Model</h3>
        <div className="small">Current model (read-only): {model}</div>
      </div>
      <div className="card">
        <h3>Sticky memory (always included)</h3>
        <div className="small">One item per line. Keep it short.</div>
        <textarea value={stickyText} onChange={e=>setStickyText(e.target.value)} />
        <div className="row">
          <button onClick={saveSticky}>Save sticky</button>
        </div>
      </div>
    </LoginGate>
  );
}
