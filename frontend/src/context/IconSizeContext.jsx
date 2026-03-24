import { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { useMode } from '../hooks/useMode.js';

const STORAGE_KEY = 'mjqbe_icon_sizes';
const VALID = ['small', 'medium', 'large'];
const DEFAULTS = { TV: 'medium', Desktop: 'medium' };

export const IconSizeContext = createContext(null);

function loadSizes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      return {
        TV: VALID.includes(saved.TV) ? saved.TV : 'medium',
        Desktop: VALID.includes(saved.Desktop) ? saved.Desktop : 'medium',
      };
    }
  } catch {}
  return { ...DEFAULTS };
}

export function IconSizeProvider({ children }) {
  const { mode } = useMode();
  const [sizes, setSizes] = useState(loadSizes);
  const modeRef = useRef(mode);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  const iconSize = sizes[mode] ?? 'medium';

  const setIconSize = useCallback((next) => {
    if (!VALID.includes(next)) return;
    setSizes((prev) => {
      const updated = { ...prev, [modeRef.current]: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Used by useSettings to hydrate both modes from DB at once
  const setAllSizes = useCallback((next) => {
    const merged = {
      TV: VALID.includes(next?.TV) ? next.TV : 'medium',
      Desktop: VALID.includes(next?.Desktop) ? next.Desktop : 'medium',
    };
    setSizes(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }, []);

  return (
    <IconSizeContext.Provider value={{ iconSize, sizes, setIconSize, setAllSizes }}>
      {children}
    </IconSizeContext.Provider>
  );
}
