'use client';
import React, { useEffect, useState } from 'react';

export default function LoginGate({ children }:{children:React.ReactNode}){
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState('');

  useEffect(()=>{
    const v = localStorage.getItem('pw-ok');
    if (v === '1') setOk(true);
  },[]);

  async function submit() {
    const res = await fetch('/api/ping', { headers: { 'X-App-Pass': pw } });
    if (res.ok) { localStorage.setItem('pw-ok','1'); setOk(true); }
    else alert('Wrong password.');
  }

  if (ok) return <>{children}</>;
  return (
    <div className="card">
      <h3>Enter App Password</h3>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" />
      <div className="row" style={{marginTop:8}}>
        <button onClick={submit}>Unlock</button>
      </div>
      <div className="small">Set APP_PASSWORD in Vercel.</div>
    </div>
  );
}
