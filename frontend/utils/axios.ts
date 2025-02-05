import axios, { HttpStatusCode } from "axios";

export const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axios.post("/api/refresh-token");

        return axiosClient(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/logout";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
