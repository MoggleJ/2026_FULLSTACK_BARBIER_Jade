import { createContext, useState } from 'react';

export const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('mjqbe_mode') || 'TV'
  );

  const changeMode = (next) => {
    setMode(next);
    localStorage.setItem('mjqbe_mode', next);
  };

  const toggleMode = () => changeMode(mode === 'TV' ? 'Desktop' : 'TV');

  return (
    <ModeContext.Provider value={{ mode, changeMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}
