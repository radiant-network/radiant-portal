import axios, { HttpStatusCode } from 'axios';

import { redirectToLogout, resetAuthRedirectAttempts } from './auth-redirect';

export const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshTokenPromise: Promise<any> | null = null;

axiosClient.interceptors.response.use(
  response => {
    resetAuthRedirectAttempts();
    return response;
  },
  async error => {
    const originalRequest = error.config;

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
