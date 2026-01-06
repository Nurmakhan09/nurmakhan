import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SettingsPanel({ onTheme, onFocus }) {
  const [settings, setSettings] = useState({ darkMode: true, zoom:1, focusMode:false });

  useEffect(()=> {
    (async ()=> {
      try {
        const res = await axios.get('/profile');
        if (res.data?.settings) setSettings(JSON.parse(res.data.settings || JSON.stringify(settings)));
      }catch(e){}
    })();
  }, []);

  useEffect(()=> {
    onTheme(settings.darkMode ? 'dark' : 'light');
    onFocus(settings.focusMode);
  }, [settings]);

  async function save() {
    await axios.put('/settings', { settings });
    alert('Settings saved');
  }

  return (
    <div className="panel" style={{ flexDirection:'row', gap:8, alignItems:'center' }}>
      <label style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input type="checkbox" checked={settings.darkMode} onChange={e => setSettings({...settings, darkMode: e.target.checked})} />
        Dark
      </label>
      <label style={{ display:'flex', gap:8, alignItems:'center' }}>
        Zoom
        <input type="range" min="0.8" max="1.4" step="0.05" value={settings.zoom} onChange={e => setSettings({...settings, zoom: parseFloat(e.target.value)})} />
      </label>
      <label style={{ display:'flex', gap:8, alignItems:'center' }}>
        Focus
        <input type="checkbox" checked={settings.focusMode} onChange={e => setSettings({...settings, focusMode: e.target.checked})} />
      </label>
      <button className="button" onClick={save}>Save</button>
    </div>
  );
}