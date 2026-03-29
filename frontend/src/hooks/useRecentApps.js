import { useState } from 'react';

const RECENT_KEY = 'mjqbe_recent';
const MAX_RECENT = 8;

function readRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) ?? []; }
  catch { return []; }
}

export function addToRecent(app) {
  try {
    const stored = readRecent().filter((a) => a.id !== app.id);
    stored.unshift({
      id: app.id,
      name: app.name,
      icon: app.icon,
      url: app.url,
      mode: app.mode,
      is_external: app.is_external,
      category_id: app.category_id ?? null,
    });
    localStorage.setItem(RECENT_KEY, JSON.stringify(stored.slice(0, MAX_RECENT)));
  } catch { /* ignore */ }
}

export function useRecentApps() {
  const [recentApps] = useState(readRecent);
  return { recentApps };
}
