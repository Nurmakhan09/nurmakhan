import React, { useEffect, useRef, useState } from 'react';
import CanvasDrawer from './CanvasDrawer';
import EssayEditor from './EssayEditor';
import MusicPlayer from './MusicPlayer';
import HomePage from './pages/HomePage';

/**
 * Renders book pages and animates page turns.
 */
export default function BookPages({ activePage, onChangePage, locked, errorShake }) {
  const pageRef = useRef();
  const [turning, setTurning] = useState(false);

  useEffect(()=> {
    // when activePage changes, trigger turning animation
    setTurning(true);
    const t = setTimeout(()=> setTurning(false), 500);
    return ()=> clearTimeout(t);
  }, [activePage]);

  return (
    <div className={`page ${turning ? 'turning' : ''}`} ref={pageRef}>
      {/* show cover when locked */}
      {locked && <LockedDescription />}
      {!locked && (
        <>
          {activePage === 'home' && <HomePage onOpen={onChangePage} />}
          {activePage === 'canvas' && <CanvasDrawer />}
          {activePage === 'editor' && <EssayEditor />}
          {activePage === 'music' && <MusicPlayer />}
          {activePage === 'settings' && <div style={{color:'var(--muted)'}}>Settings page opened — use top-right settings for global controls.</div>}
        </>
      )}
      {/* subtle page corner decoration */}
      <div style={{ position:'absolute', right:16, bottom:12, color:'var(--muted)', fontSize:12 }}>Page • LivingBook</div>
    </div>
  );
}

function LockedDescription() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center', justifyContent:'center', height:'100%' }}>
      <div style={{ fontSize:28, fontWeight:700 }}>Living Book</div>
      <div style={{ color:'var(--muted)', maxWidth:600, textAlign:'center' }}>A focused, minimal environment for long study sessions. Log in to unlock your personalized study book with pages for drawing, writing, shortcuts and music.</div>
    </div>
  );
}