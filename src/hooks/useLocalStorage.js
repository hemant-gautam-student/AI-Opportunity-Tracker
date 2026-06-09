import { useState, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep a ref to the latest storedValue so setValue stays stable
  const storedRef = useRef(storedValue);
  storedRef.current = storedValue;

  const setValue = useCallback(
    (value) => {
      try {
        const resolved = value instanceof Function ? value(storedRef.current) : value;
        setStoredValue(resolved);
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}