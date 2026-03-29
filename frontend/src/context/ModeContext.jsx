import { createContext, useState, useCallback } from 'react';

export const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('mjqbe_mode') || 'TV'
  );

  const changeMode = useCallback((next) => {
    setMode(next);
    localStorage.setItem('mjqbe_mode', next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next = current === 'TV' ? 'Desktop' : 'TV';
      localStorage.setItem('mjqbe_mode', next);
      return next;
    });
  }, []);

  return (
    <ModeContext.Provider value={{ mode, changeMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}
