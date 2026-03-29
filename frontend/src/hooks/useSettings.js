import { useCallback } from 'react';
import { useTheme } from './useTheme.js';
import { useMode } from './useMode.js';
import { useIconSize } from './useIconSize.js';
import { useLayout } from './useLayout.js';
import { fetchSettings, putSettings } from '../api/settings.js';

export function useSettings() {
  const { setTheme } = useTheme();
  const { changeMode, mode } = useMode();
  const { setIconSize, setAllSizes, sizes } = useIconSize();
  const { changeLayout } = useLayout();

  const loadFromDB = useCallback(async () => {
    try {
      const { settings } = await fetchSettings();
      if (settings.theme) setTheme(settings.theme);
      if (settings.mode)  changeMode(settings.mode);
      if (settings.icon_size) {
        if (typeof settings.icon_size === 'object') {
          setAllSizes(settings.icon_size);
        } else {
          setIconSize(settings.icon_size);
        }
      }
      if (settings.layout) changeLayout(settings.layout);
    } catch {
      // Silently fail — localStorage reste actif
    }
  }, [setTheme, changeMode, setIconSize, setAllSizes, changeLayout]);

  const saveToDB = useCallback(async (patch) => {
    try {
      await putSettings(patch);
    } catch {
      // Silently fail
    }
  }, []);

  const applyTheme = useCallback((next) => {
    setTheme(next);
    saveToDB({ theme: next });
  }, [setTheme, saveToDB]);

  const applyMode = useCallback((next) => {
    changeMode(next);
    saveToDB({ mode: next });
  }, [changeMode, saveToDB]);

  const applyIconSize = useCallback((next) => {
    setIconSize(next);
    saveToDB({ icon_size: { ...sizes, [mode]: next } });
  }, [setIconSize, saveToDB, sizes, mode]);

  const applyLayout = useCallback((next) => {
    changeLayout(next);
    saveToDB({ layout: next });
  }, [changeLayout, saveToDB]);

  return { loadFromDB, saveToDB, applyTheme, applyMode, applyIconSize, applyLayout };
}
