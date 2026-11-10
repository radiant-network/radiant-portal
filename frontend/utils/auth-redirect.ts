const AUTH_REDIRECT_STORAGE_KEY = 'auth-redirect-attempts';
const AUTH_REDIRECT_MAX_ATTEMPTS = 3;
const AUTH_REDIRECT_WINDOW_MS = 30_000;

type Attempts = { count: number; firstAt: number };

export type RedirectEnv = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  navigate: (url: string) => void;
  currentPath: () => string;
  now: () => number;
};

const readAttempts = (env: RedirectEnv, now: number): Attempts => {
  const raw = env.getItem(AUTH_REDIRECT_STORAGE_KEY);
  if (!raw) return { count: 0, firstAt: now };
  try {
    const parsed = JSON.parse(raw) as Partial<Attempts>;
    if (typeof parsed.count !== 'number' || typeof parsed.firstAt !== 'number') return { count: 0, firstAt: now };
    if (now - parsed.firstAt > AUTH_REDIRECT_WINDOW_MS) return { count: 0, firstAt: now };
    return { count: parsed.count, firstAt: parsed.firstAt };
  } catch {
    return { count: 0, firstAt: now };
  }
};

/**
 * Pure variant. Returns true when the redirect to /auth/logout was dispatched; false when
 * too many consecutive attempts happened in the rolling window (likely a persistent 401 unrelated
 * to session expiry — caller should fall back to the normal error UI instead of looping).
 */
export const redirectToLogoutWith = (env: RedirectEnv): boolean => {
  const now = env.now();
  const attempts = readAttempts(env, now);
  const next = { count: attempts.count + 1, firstAt: attempts.firstAt };
  env.setItem(AUTH_REDIRECT_STORAGE_KEY, JSON.stringify(next));
  if (next.count > AUTH_REDIRECT_MAX_ATTEMPTS) return false;
  env.navigate(`/auth/logout?returnTo=${encodeURIComponent(env.currentPath())}`);
  return true;
};

export const resetAuthRedirectAttemptsWith = (env: Pick<RedirectEnv, 'getItem' | 'removeItem'>) => {
  if (env.getItem(AUTH_REDIRECT_STORAGE_KEY)) env.removeItem(AUTH_REDIRECT_STORAGE_KEY);
};

const browserEnv = (): RedirectEnv => ({
  getItem: key => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
  removeItem: key => sessionStorage.removeItem(key),
  navigate: url => {
    window.location.href = url;
  },
  currentPath: () => `${window.location.pathname}${window.location.search}`,
  now: () => Date.now(),
});

export const redirectToLogout = (): boolean => redirectToLogoutWith(browserEnv());
export const resetAuthRedirectAttempts = () => resetAuthRedirectAttemptsWith(browserEnv());
