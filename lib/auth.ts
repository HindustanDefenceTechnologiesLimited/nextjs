// lib/auth.ts
import axios from "axios";
import api from "./api";
import { store } from "@/store/store";
import { logout, setAccessToken } from "@/store/slices/authSlice";

// Attach token from Redux to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (Refresh Logic)
// Response interceptor with safe refresh logic
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url || "";
    const isRefreshRequest = url.includes("/api/auth/refresh");

    if (status === 401 && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        const base = api.defaults.baseURL || "";
        const refreshResponse = await axios.post(
          `${base.replace(/\/$/, "")}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.accessToken;

        if (!newToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // ✔ FIX: UPDATE REDUX AUTH STATE
        store.dispatch(setAccessToken(newToken));

        // ✔ Apply new token to retry request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // ✔ Retry with the correct token
        return api(originalRequest);

      } catch (refreshErr) {
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
