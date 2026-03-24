import { createContext, useState } from 'react';

const STORAGE_KEY = 'mjqbe_clock_format';

export const ClockFormatContext = createContext(null);

export function ClockFormatProvider({ children }) {
  const [clockFormat, setClockFormatState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || '24h'
  );

  const setClockFormat = (next) => {
    setClockFormatState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const toggleClockFormat = () =>
    setClockFormat(clockFormat === '24h' ? '12h' : '24h');

  return (
    <ClockFormatContext.Provider value={{ clockFormat, setClockFormat, toggleClockFormat }}>
      {children}
    </ClockFormatContext.Provider>
  );
}
