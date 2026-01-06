import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Minimal music search + playlist (stubbed).
 * Integrate with real music backends (Spotify, YouTube) for production.
 */
export default function MusicPlayer() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [playing, setPlaying] = useState(null);

  async function search() {
    const res = await axios.get(`/music/search?q=${encodeURIComponent(q)}`);
    setResults(res.data);
  }

  function play(track) {
    setPlaying(track);
    // open in new tab for actual playback in this stub
    window.open(track.url, '_blank');
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', gap:8 }}>
        <input placeholder="Search music for focus..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="button" onClick={search}>Search</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {results.map(t => (
          <div key={t.id} style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
            <div style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ fontWeight:700 }}>{t.title}</div>
              <div style={{ color:'var(--muted)', fontSize:12 }}>{t.artist}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="button" onClick={()=> play(t)}>Play</button>
              <button className="button" onClick={()=> alert('Add to playlist (future)')}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}