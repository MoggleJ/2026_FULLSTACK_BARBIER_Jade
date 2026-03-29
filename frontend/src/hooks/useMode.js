import { useContext } from 'react';
import { ModeContext } from '../context/ModeContext.jsx';

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode doit être utilisé dans un ModeProvider');
  return ctx;
}
