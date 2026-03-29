import { useContext } from 'react';
import { LayoutContext } from '../context/LayoutContext.jsx';

export function useLayout() {
  return useContext(LayoutContext);
}
