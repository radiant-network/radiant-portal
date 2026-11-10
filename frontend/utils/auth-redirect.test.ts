import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type RedirectEnv, redirectToLogoutWith, resetAuthRedirectAttemptsWith } from './auth-redirect';

type FakeEnvOptions = { path?: string; nowOverride?: () => number };

const fakeEnv = ({ path = '/cbtn/patient?tab=patient-list', nowOverride }: FakeEnvOptions = {}) => {
  const store = new Map<string, string>();
  const navigate = vi.fn();
  const env: RedirectEnv = {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: key => {
      store.delete(key);
    },
    navigate,
    currentPath: () => path,
    now: nowOverride ?? (() => 1_000_000),
  };
  return { env, navigate, store };
};

describe('redirectToLogoutWith', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates to /auth/logout with the current path on first call', () => {
    const { env, navigate } = fakeEnv();
    const result = redirectToLogoutWith(env);
    expect(result).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/auth/logout?returnTo=%2Fcbtn%2Fpatient%3Ftab%3Dpatient-list');
  });

  it('persists an attempt counter so a stuck loop can be detected', () => {
    const { env, store } = fakeEnv();
    redirectToLogoutWith(env);
    expect(JSON.parse(store.get('auth-redirect-attempts')!).count).toBe(1);
  });

  it('still navigates up to the max attempt threshold within the window', () => {
    const { env, navigate } = fakeEnv();
    for (let i = 0; i < 3; i++) redirectToLogoutWith(env);
    expect(navigate).toHaveBeenCalledTimes(3);
  });

  it('refuses to navigate past the threshold and returns false', () => {
    const { env, navigate } = fakeEnv();
    for (let i = 0; i < 3; i++) redirectToLogoutWith(env);
    const result = redirectToLogoutWith(env);
    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledTimes(3);
  });

  it('resets the counter once the rolling window has elapsed', () => {
    let now = 1_000_000;
    const { env, navigate } = fakeEnv({ nowOverride: () => now });
    for (let i = 0; i < 3; i++) redirectToLogoutWith(env);
    expect(redirectToLogoutWith(env)).toBe(false);

    now += 31_000;
    expect(redirectToLogoutWith(env)).toBe(true);
    expect(navigate).toHaveBeenCalledTimes(4);
  });

  it('ignores corrupt storage and starts a fresh counter', () => {
    const { env, navigate, store } = fakeEnv();
    store.set('auth-redirect-attempts', 'not-json');
    expect(redirectToLogoutWith(env)).toBe(true);
    expect(navigate).toHaveBeenCalledOnce();
  });
});

describe('resetAuthRedirectAttemptsWith', () => {
  it('clears the counter when present', () => {
    const { env, store } = fakeEnv();
    store.set('auth-redirect-attempts', JSON.stringify({ count: 2, firstAt: 1_000_000 }));
    resetAuthRedirectAttemptsWith(env);
    expect(store.has('auth-redirect-attempts')).toBe(false);
  });

  it('is a no-op when the counter is absent', () => {
    const { env } = fakeEnv();
    const removeItem = vi.spyOn(env, 'removeItem');
    resetAuthRedirectAttemptsWith(env);
    expect(removeItem).not.toHaveBeenCalled();
  });
});
