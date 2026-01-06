import React, { useEffect, useState } from 'react';
import BookShell from './components/BookShell';
import { AuthProvider } from './lib/auth';

export default function App() {
  // top-level theme and focus management
  const [theme, setTheme] = useState('dark');
  const [focus, setFocus] = useState(false);

  useEffect(()=> {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <div className="app" data-focus={focus}>
        <BookShell setTheme={setTheme} setFocus={setFocus} />
      </div>
    </AuthProvider>
  );
}