import { useContext } from 'react';
import { ClockFormatContext } from '../context/ClockFormatContext.jsx';

export function useClockFormat() {
  const ctx = useContext(ClockFormatContext);
  if (!ctx) throw new Error('useClockFormat must be used inside ClockFormatProvider');
  return ctx;
}
