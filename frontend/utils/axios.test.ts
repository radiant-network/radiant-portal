import i18next from 'i18next';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const mutate = vi.hoisted(() => vi.fn());
vi.mock('swr', () => ({ mutate }));
vi.mock('./auth-redirect', () => ({
  isEdgeSessionExpired: vi.fn(),
  redirectToLogout: vi.fn(),
  reloadForEdgeReauth: vi.fn(),
  resetAuthRedirectAttempts: vi.fn(),
}));

import { axiosClient } from './axios';

// Reads the header the interceptors set, without sending the request.
const sentLanguage = async () => {
  let language: unknown;
  await axiosClient.get('/cases/1', {
    adapter: async config => {
      language = config.headers.get('Accept-Language');
      return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
    },
  });
  return language;
};

beforeAll(async () => {
  await i18next.init({ lng: 'en', supportedLngs: ['en', 'fr'] });
});

beforeEach(async () => {
  await i18next.changeLanguage('en');
  mutate.mockReset();
});

describe('axiosClient', () => {
  it('sends the app language and follows a language change', async () => {
    expect(await sentLanguage()).toBe('en');
    await i18next.changeLanguage('fr');
    expect(await sentLanguage()).toBe('fr');
  });

  it('revalidates every cached request on a language change', async () => {
    await i18next.changeLanguage('fr');
    expect(mutate).toHaveBeenCalledOnce();
    const [keyFilter] = mutate.mock.calls[0];
    expect(keyFilter('/cases/1')).toBe(true);
  });
});
