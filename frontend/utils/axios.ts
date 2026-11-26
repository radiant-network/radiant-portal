import axios, { AxiosError, HttpStatusCode } from 'axios';
import i18next from 'i18next';
import { mutate } from 'swr';

import {
  isEdgeSessionExpired,
  redirectToLogout,
  reloadForEdgeReauth,
  resetAuthRedirectAttempts,
} from './auth-redirect';

export const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// The app's language, not the browser's: the API serves its labels in it.
axiosClient.interceptors.request.use(config => {
  if (i18next.language) config.headers.set('Accept-Language', i18next.language);
  return config;
});

// SWR keys do not hold the language: refetch every cached request in the new one.
i18next.on('languageChanged', () => {
  void mutate(() => true);
});

let refreshTokenPromise: Promise<any> | null = null;

axiosClient.interceptors.response.use(
  response => {
    resetAuthRedirectAttempts();
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (!error.response && error.code === AxiosError.ERR_NETWORK && (await isEdgeSessionExpired())) {
      if (reloadForEdgeReauth()) return new Promise(() => {});
      return Promise.reject(error);
    }

    if (refreshTokenPromise) {
      try {
        await refreshTokenPromise;
        return axiosClient(originalRequest);
      } catch {
        if (redirectToLogout()) return new Promise(() => {});
        return Promise.reject(error);
      }
    }

    if (error.response?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        refreshTokenPromise = axios.post('/auth/refresh-token').finally(() => {
          refreshTokenPromise = null;
        });

        await refreshTokenPromise;

        return axiosClient(originalRequest);
      } catch {
        if (redirectToLogout()) return new Promise(() => {});
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
