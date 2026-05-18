import { useCallback } from 'react';

export default function useLocalStorage(key: string) {
  const getLocalStorage = useCallback(() => {
    return localStorage.getItem(key) || '';
  }, [key]);

  const setLocalStorage = useCallback(
    (value: string) => {
      localStorage.setItem(key, value);
    },
    [key]
  );

  return { getLocalStorage, setLocalStorage };
}
