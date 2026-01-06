import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';

/**
 * Locked book cover UI — embedded login/register interactions.
 * Animations: when incorrect credentials -> shake + red glow.
 * On success -> call onUnlock.
 */
export default function LoginCover({ locked, onUnlock, onError, errorShake }) {
  const { login, register } = useAuth();
  const [view, setView] = useState('landing'); // landing / login / register
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);

  useEffect(()=> {
    if (!locked) setView('landing');
  }, [locked]);

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setLoading(true); setError(null);
    try {
      await login({ usernameOrEmail: form.emailOrUser, password: form.password });
      onUnlock();
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
      onError();
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e && e.preventDefault();
    setLoading(true); setError(null);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      onUnlock();
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
      onError();
    } finally { setLoading(false); }
  };

  // Visual states
  const coverStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  };

  return (
    <div className="lock-overlay" style={{ pointerEvents: locked ? 'auto' : 'none' }}>
      <div className="panel" style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <div style={{
            width:48, height:48, borderRadius:8,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700
          }}>
            LB
          </div>
          <div>
            <div style={{ fontWeight:700 }}>Living Book</div>
            <div style={{ color:'var(--muted)', fontSize:12 }}>Deep-focus study</div>
          </div>
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <button className="button" onClick={()=> setView('login')}>Кіру</button>
          <button className="button" onClick={()=> setView('register')}>Тіркелу</button>
        </div>
      </div>

      <div style={{ marginTop:16, width:'100%' }}>
        {view === 'landing' && (
          <div className="panel" style={{ padding:16, flexDirection:'column', gap:8 }}>
            <div style={{ fontWeight:600 }}>Welcome</div>
            <div style={{ color:'var(--muted)', fontSize:13 }}>Your study space is locked inside this book. Log in to unlock and open it.</div>
          </div>
        )}

        {view === 'login' && (
          <form className="panel" onSubmit={handleLogin} style={{ flexDirection:'column', gap:8 }}>
            <input placeholder="Имя или Email" value={form.emailOrUser||''} onChange={e=>setForm({...form, emailOrUser:e.target.value})} />
            <input placeholder="Пароль" type="password" value={form.password||''} onChange={e=>setForm({...form, password:e.target.value})} />
            <div style={{ display:'flex', gap:8 }}>
              <button className="button" type="submit" disabled={loading}>Кіру</button>
              <button className="button" type="button" onClick={()=> setView('landing')}>Артқа</button>
            </div>
            {error && <div style={{ color:'#ff6b6b', marginTop:6 }}>{error}</div>}
            {/* error animation visual: shake + red glow */}
            <style>{`
              .lock-overlay .panel { transition: box-shadow 200ms ease; }
              .lock-overlay.shake .panel { animation:shake 700ms; box-shadow: 0 0 0 4px rgba(255,90,90,0.06); }
              @keyframes shake {
                0%{ transform: translateX(0); }
                20%{ transform: translateX(-8px) rotate(-1deg); }
                40%{ transform: translateX(8px) rotate(1deg); }
                60%{ transform: translateX(-6px) rotate(-0.5deg); }
                80%{ transform: translateX(6px) rotate(0.5deg); }
                100%{ transform: translateX(0); }
              }
            `}</style>
          </form>
        )}

        {view === 'register' && (
          <form className="panel" onSubmit={handleRegister} style={{ flexDirection:'column', gap:8 }}>
            <input placeholder="Аты-жөні" value={form.username||''} onChange={e=>setForm({...form, username:e.target.value})} />
            <input placeholder="Email" value={form.email||''} onChange={e=>setForm({...form, email:e.target.value})} />
            <input placeholder="Пароль" type="password" value={form.password||''} onChange={e=>setForm({...form, password:e.target.value})} />
            <div style={{ display:'flex', gap:8 }}>
              <button className="button" type="submit" disabled={loading}>Тіркелу</button>
              <button className="button" type="button" onClick={()=> setView('landing')}>Артқа</button>
            </div>
            {error && <div style={{ color:'#ff6b6b', marginTop:6 }}>{error}</div>}
          </form>
        )}
      </div>

      {/* global error shake: toggle class */}
      <div style={{ display:'none' }} id="login-shake-flag" />
    </div>
  );
}