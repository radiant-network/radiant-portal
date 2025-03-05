import { useState, useEffect } from 'react';

/**
 * Debounce a value
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => ReturnType<T> {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): ReturnType<T> => {
    clearTimeout(timer);
    return new Promise<ReturnType<T>>(resolve => {
      timer = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    }) as unknown as ReturnType<T>;
  };
}
