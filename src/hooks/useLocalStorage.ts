"use client";

import { useState, useEffect, useCallback } from "react";

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

/**
 * Typed localStorage hook with SSR safety.
 * Falls back gracefully on server where localStorage is not available.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, () => void] {
  // SSR-safe initializer — read from localStorage only on the client
  const readStoredValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const [storedValue, setStoredValue] = useState<T>(readStoredValue);

  // Sync state when the key changes (e.g. user logs in/out)
  useEffect(() => {
    setStoredValue(readStoredValue());
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        setStoredValue((prev) => {
          const valueToStore =
            typeof value === "function"
              ? (value as (prev: T) => T)(prev)
              : value;

          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }

          return valueToStore;
        });
      } catch (error) {
        console.warn(`useLocalStorage: error setting key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: error removing key "${key}":`, error);
    }
  }, [key, initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          const newValue =
            event.newValue !== null
              ? (JSON.parse(event.newValue) as T)
              : initialValue;
          setStoredValue(newValue);
        } catch {
          // Ignore parse errors from other tabs
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
