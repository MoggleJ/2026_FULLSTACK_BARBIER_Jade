import { createContext, useState, useMemo } from 'react';
import fr from '../i18n/fr.js';
import en from '../i18n/en.js';

const TRANSLATIONS = { fr, en };
const STORAGE_KEY = 'mjqbe_lang';

export const LangContext = createContext(null);

function createT(translations) {
  return function t(key, vars = {}) {
    const parts = key.split('.');
    let value = translations;
    for (const part of parts) {
      value = value?.[part];
    }
    if (typeof value !== 'string') return parts[parts.length - 1];
    return Object.entries(vars).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, v),
      value
    );
  };
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'fr'
  );

  const setLang = (next) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const t = useMemo(
    () => createT(TRANSLATIONS[lang] ?? fr),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
