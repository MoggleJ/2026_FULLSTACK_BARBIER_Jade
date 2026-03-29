import { useContext } from 'react';
import { IconSizeContext } from '../context/IconSizeContext.jsx';

export function useIconSize() {
  const ctx = useContext(IconSizeContext);
  if (!ctx) throw new Error('useIconSize must be used inside IconSizeProvider');
  return ctx;
}
