import { useEffect } from 'react';

export const useTelegram = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp) window.Telegram.WebApp.ready();
  }, []);
};