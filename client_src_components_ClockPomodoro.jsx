import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

/**
 * Clock + Pomodoro component always visible in top-right.
 * Tracks current time, allows starting pomodoro, and reports session stats.
 */
export default function ClockPomodoro() {
  const [time, setTime] = useState(new Date());
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroRemaining, setPomodoroRemaining] = useState(25*60);
  const timerRef = useRef();

  useEffect(()=> {
    const t = setInterval(()=> setTime(new Date()), 1000);
    return ()=> clearInterval(t);
  }, []);

  useEffect(()=> {
    if (running) {
      timerRef.current = setInterval(()=> {
        setSeconds(s => s + 1);
        if (pomodoroMode) {
          setPomodoroRemaining(p => {
            if (p <= 1) {
              // finished
              setPomodoroMode(false);
              setRunning(false);
              notify('Pomodoro complete — take a break');
              return 0;
            }
            return p - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return ()=> clearInterval(timerRef.current);
  }, [running, pomodoroMode]);

  useEffect(()=> {
    // report session periodically or when stopped
    return () => {
      if (seconds > 5 && localStorage.getItem('lb_token')) {
        axios.post('/stats/session', { seconds, pomodoroSeconds: pomodoroMode ? (25*60 - pomodoroRemaining) : 0 }).catch(()=>{});
      }
    };
  }, [seconds, pomodoroMode, pomodoroRemaining]);

  function toggle() { setRunning(r => !r); }
  function startPomodoro() { setPomodoroMode(true); setPomodoroRemaining(25*60); setRunning(true); }
  function notify(message) { if (Notification && Notification.permission === 'granted') new Notification(message); }

  return (
    <div className="panel" style={{ flexDirection:'column', minWidth:140 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:700, fontSize:13 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div style={{ color:'var(--muted)', fontSize:12 }}>{time.toLocaleDateString()}</div>
      </div>

      <div style={{ display:'flex', gap:8, marginTop:8, alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:12, color:'var(--muted)' }}>{formatTime(seconds)}</div>
        <div style={{ display:'flex', gap:6 }}>
          <button className="button" onClick={toggle}>{running ? 'Pause' : 'Start'}</button>
          <button className="button" onClick={startPomodoro}>Pomodoro</button>
        </div>
      </div>

      {pomodoroMode && <div style={{ marginTop:8, color:'var(--accent)' }}>Pomodoro: {formatTime(pomodoroRemaining)}</div>}
    </div>
  );
}

function formatTime(sec) {
  const m = Math.floor(sec/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}