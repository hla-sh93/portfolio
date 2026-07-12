"use client";

import { useState, useEffect } from "react";

/**
 * Debounce a value by a configurable delay.
 * The returned value only updates after the specified delay has elapsed
 * without the input value changing.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
