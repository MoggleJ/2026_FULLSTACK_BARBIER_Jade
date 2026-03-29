import { createContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'mjqbe_layout';
const VALID = ['grid', 'list'];

export const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return VALID.includes(saved) ? saved : 'grid';
  });

  const changeLayout = useCallback((next) => {
    if (!VALID.includes(next)) return;
    setLayout(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <LayoutContext.Provider value={{ layout, changeLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}
