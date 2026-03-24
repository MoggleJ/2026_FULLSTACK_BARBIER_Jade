import { useState, useEffect } from 'react';

function formatTime(date, format) {
  if (format === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function useClock(format = '24h') {
  const [time, setTime] = useState(() => formatTime(new Date(), format));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date(), format)), 1000);
    return () => clearInterval(id);
  }, [format]);

  return time;
}
