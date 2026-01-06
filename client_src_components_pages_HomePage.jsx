import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage({ onOpen }) {
  const [shortcuts, setShortcuts] = useState([]);

  useEffect(()=> { fetchStartups(); }, []);

  async function fetchStartups() {
    try {
      const res = await axios.get('/shortcuts');
      setShortcuts(res.data);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:20, fontWeight:700 }}>Welcome back</div>
          <div style={{ color:'var(--muted)' }}>Open a page, start a Pomodoro, or jump to a link.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="button" onClick={()=> onOpen('canvas')}>Open Canvas</button>
          <button className="button" onClick={()=> onOpen('editor')}>Write Essay</button>
        </div>
      </div>

      <div>
        <div style={{ fontWeight:700, marginBottom:8 }}>Quick shortcuts</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {shortcuts.map(s => (
            <a key={s.id} className="button" style={{ textDecoration:'none' }} href={s.url} target="_blank" rel="noreferrer">
              {s.title}
            </a>
          ))}
          <button className="button" onClick={()=> openDialog()}>+ Add</button>
        </div>
      </div>
    </div>
  );

  function openDialog(){
    const title = prompt('Shortcut name');
    if (!title) return;
    const url = prompt('URL');
    if (!url) return;
    axios.post('/shortcuts', { title, url }).then(()=> fetchStartups());
  }
}