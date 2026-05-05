import { useEffect, useState, useSyncExternalStore } from 'react';

type FlagType = 'flag' | 'pin' | 'star';

const flagStore = new Map<string, FlagType>();
const emitter = new EventTarget();
let version = 0;

function subscribe(callback: () => void) {
  const handler = () => callback();
  emitter.addEventListener('flag-change', handler);
  return () => emitter.removeEventListener('flag-change', handler);
}

function useVariantFlag(locusId: string) {
  const [flag, setLocalFlag] = useState<FlagType | null>(() => flagStore.get(locusId) ?? null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { locusId: id, flag: value } = (e as CustomEvent).detail;
      if (id === locusId) {
        setLocalFlag(value);
      }
    };
    emitter.addEventListener('flag-change', handler);
    return () => emitter.removeEventListener('flag-change', handler);
  }, [locusId]);

  const setFlag = (value: FlagType | null) => {
    if (value) {
      flagStore.set(locusId, value);
    } else {
      flagStore.delete(locusId);
    }
    version++;
    setLocalFlag(value);
    emitter.dispatchEvent(new CustomEvent('flag-change', { detail: { locusId, flag: value } }));
  };

  return [flag, setFlag] as const;
}

function useFlagsVersion() {
  return useSyncExternalStore(
    subscribe,
    () => version,
    () => version,
  );
}

export { type FlagType, useVariantFlag, useFlagsVersion, flagStore };
