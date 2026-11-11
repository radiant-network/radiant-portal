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

const EDGE_PROBE_PATH = '/health-check';

/**
 * AWS Verified Access answers requests made with an expired session by a cross-origin 303 to the IdP,
 * which fetch/XHR only surface as a CORS network error. A same-origin probe with `redirect: 'manual'`
 * tells that case apart from a real outage: it resolves as an opaque redirect instead of throwing.
 */
export const isEdgeSessionExpiredWith = async (fetchFn: typeof fetch): Promise<boolean> => {
  try {
    const response = await fetchFn(EDGE_PROBE_PATH, { redirect: 'manual', cache: 'no-store', credentials: 'include' });
    return response.type === 'opaqueredirect';
  } catch {
    return false;
  }
};

export const isEdgeSessionExpired = (): Promise<boolean> => isEdgeSessionExpiredWith(fetch);

/**
 * A full page load lets the browser follow the edge redirect to the IdP and back. Shares the attempt
 * counter with redirectToLogout so a misdiagnosed outage cannot loop.
 */
export const reloadForEdgeReauth = (): boolean =>
  redirectToLogoutWith({ ...browserEnv(), navigate: () => window.location.reload() });
