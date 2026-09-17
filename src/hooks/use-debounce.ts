"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to debounce rapidly changing values (such as search inputs).
 *
 * @param value The raw input value to debounce.
 * @param delay Milliseconds to wait after the last change before updating the debounced value (default: 400ms).
 * @returns [debouncedValue, flush, isPending]
 *   - debouncedValue: The stabilized value after the debounce period.
 *   - flush: Callback to immediately apply the current or a custom value without waiting.
 *   - isPending: Boolean indicating whether an update is currently scheduled.
 */
export function useDebounce<T>(
  value: T,
  delay: number = 1000,
): [T, (immediateValue?: T) => void, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(
    (immediateValue?: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setDebouncedValue(immediateValue !== undefined ? immediateValue : value);
    },
    [value],
  );

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  const isPending = value !== debouncedValue;

  return [debouncedValue, flush, isPending];
}
