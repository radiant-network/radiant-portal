import { useEffect, useState } from 'react';

/**
 * Generic type for an object where all values are string arrays.
 */
export type StringArrayRecord = Record<string, string[]>;

/**
 * Drop persisted keys the caller no longer declares in its defaults.
 */
export function pruneUnknownKeys<T extends StringArrayRecord>(persisted: StringArrayRecord, defaults: T): T {
  const pruned: StringArrayRecord = {};
  for (const key in defaults) {
    pruned[key] = persisted[key] ?? defaults[key];
  }
  return pruned as T;
}

function usePersistedFilters<T extends StringArrayRecord>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? pruneUnknownKeys(JSON.parse(item) as StringArrayRecord, initialValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistedFilters;
