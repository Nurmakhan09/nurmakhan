import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Basic essay editor with auto-save (extensible to rich tools)
 */
export default function EssayEditor() {
  const [essays, setEssays] = useState([]);
  const [current, setCurrent] = useState({ title:'Untitled', content:'' });

  useEffect(()=> { fetch(); }, []);

  async function fetch() {
    try {
      const res = await axios.get('/essays');
      setEssays(res.data);
      if (res.data.length) setCurrent(res.data[0]);
    } catch(e){}
  }

  async function save() {
    if (!current.id) {
      const res = await axios.post('/essays', current);
      setCurrent(res.data);
      fetch();
    } else {
      await axios.put(`/essays/${current.id}`, current);
      fetch();
    }
    alert('Saved');
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', gap:8 }}>
        <input value={current.title} onChange={e=>setCurrent({...current, title:e.target.value})} style={{ flex:1 }} />
        <button className="button" onClick={save}>Save</button>
      </div>
      <textarea value={current.content} onChange={e=>setCurrent({...current, content:e.target.value})}
        style={{ height:420, borderRadius:10, padding:12, background:'rgba(255,255,255,0.01)', color:'var(--text)' }} />
      <div style={{ color:'var(--muted)' }}>Tip: Use the page layout to structure your essay; autosave can be added here.</div>
    </div>
  );
}