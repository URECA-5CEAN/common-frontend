import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

export function usePrompt(when: boolean, message: string) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const originalPush = navigator.push;

    const confirmAndPush = (...args: Parameters<typeof originalPush>) => {
      const confirm = window.confirm(message);
      if (confirm) originalPush(...args);
    };

    navigator.push = confirmAndPush;

    return () => {
      navigator.push = originalPush;
    };
  }, [navigator, when, message]);
}
