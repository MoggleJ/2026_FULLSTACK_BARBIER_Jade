import { useCallback } from 'react';
import { useTheme } from './useTheme.js';
import { useMode } from './useMode.js';
import { useIconSize } from './useIconSize.js';
import { fetchSettings, putSettings } from '../api/settings.js';

export function useSettings() {
  const { setTheme } = useTheme();
  const { changeMode, mode } = useMode();
  const { setIconSize, setAllSizes, sizes } = useIconSize();

  const loadFromDB = useCallback(async () => {
    try {
      const { settings } = await fetchSettings();
      if (settings.theme) setTheme(settings.theme);
      if (settings.mode)  changeMode(settings.mode);
      if (settings.icon_size) {
        // DB can store either a string (legacy) or { TV, Desktop } object
        if (typeof settings.icon_size === 'object') {
          setAllSizes(settings.icon_size);
        } else {
          setIconSize(settings.icon_size);
        }
      }
    } catch {
      // Silently fail — localStorage reste actif
    }
  }, [setTheme, changeMode, setIconSize, setAllSizes]);

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
    // Compute updated sizes object synchronously (same logic as context's setIconSize)
    saveToDB({ icon_size: { ...sizes, [mode]: next } });
  }, [setIconSize, saveToDB, sizes, mode]);

  return { loadFromDB, saveToDB, applyTheme, applyMode, applyIconSize };
}
