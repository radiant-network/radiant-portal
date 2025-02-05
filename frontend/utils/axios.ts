import axios, { HttpStatusCode } from "axios";

export const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshTokenPromise: Promise<any> | null = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (refreshTokenPromise) {
      await refreshTokenPromise;

      return axiosClient(originalRequest);
    }

    if (
      error.response.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        refreshTokenPromise = axios.post("/api/refresh-token").finally(() => {
          refreshTokenPromise = null;
        });

        await refreshTokenPromise;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/logout";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
