import React, { useEffect, useRef, useState } from 'react';
import LoginCover from './LoginCover';
import BookPages from './BookPages';
import ClockPomodoro from './ClockPomodoro';
import ShortcutPanel from './ShortcutPanel';
import SettingsPanel from './SettingsPanel';
import { useAuth } from '../lib/auth';

/**
 * BookShell is the living-book container.
 * Manages locked/unlocked states, book-level animations and continuous motion.
 */
export default function BookShell({ setTheme, setFocus }) {
  const { user } = useAuth();
  const [locked, setLocked] = useState(!user);
  const [errorShake, setErrorShake] = useState(false);
  const [activePage, setActivePage] = useState('home'); // home, canvas, editor, music, settings
  const shellRef = useRef();

  useEffect(()=> {
    // when user logs in/out adjust locked state
    setLocked(!user);
  }, [user]);

  // error animation helper
  const triggerError = () => {
    setErrorShake(true);
    setTimeout(()=> setErrorShake(false), 800);
  };

  // Called by LoginCover after successful login
  const onUnlock = () => {
    setLocked(false);
    // small open animation handled in CSS + page turn
    setActivePage('home');
  };

  return (
    <div className="book-shell" ref={shellRef} aria-hidden={false}>
      <div className="book" role="application" aria-label="Living book study environment">
        <div className="book-cover" style={{ transform: locked ? 'translateX(0)' : 'translateX(-8px)' }}>
          <LoginCover locked={locked} onUnlock={onUnlock} onError={triggerError} errorShake={errorShake} />
          <div style={{flex:1, marginTop:10}}>
            <ShortcutPanel onOpen={(p)=> setActivePage(p)} />
          </div>
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button className="button" onClick={()=> setActivePage('canvas')}>Draw</button>
            <button className="button" onClick={()=> setActivePage('editor')}>Write</button>
            <button className="button" onClick={()=> setActivePage('music')}>Music</button>
            <button className="button" onClick={()=> setActivePage('settings')}>Settings</button>
          </div>
        </div>

        <div className="book-pages">
          <BookPages activePage={activePage} onChangePage={setActivePage} locked={locked} errorShake={errorShake} />
        </div>
      </div>

      <div className="top-right-ui">
        <ClockPomodoro />
        <SettingsPanel onTheme={setTheme} onFocus={setFocus} />
      </div>
    </div>
  );
}