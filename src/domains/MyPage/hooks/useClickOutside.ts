import { useEffect } from 'react';

export const useClickOutside = (condition: boolean, callback: () => void) => {
  useEffect(() => {
    if (!condition) return;

    const handleClick = () => callback();
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [condition, callback]);
};
