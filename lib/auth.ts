// Client: /lib/auth.ts
import axios from "axios"; // default axios (no interceptors)
import api from "./api";   // your axios.create instance (has interceptors)

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Attach Access Token automatically to every request from `api`
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor with safe refresh logic
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If there's no originalRequest (something else wrong), just reject
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;

    // Don't try to refresh if we're already retrying this request
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If the request that failed is the refresh endpoint itself, don't attempt refresh
    const url = originalRequest.url || "";
    const isRefreshRequest =
      url.includes("/api/auth/refresh") || url.includes("/auth/refresh");

    if (status === 401 && !isRefreshRequest) {
      // mark as retry so we don't try to refresh twice for the same request
      originalRequest._retry = true;

      try {
        // IMPORTANT: call refresh using the plain axios instance (which has no interceptor)
        // so the refresh call's 401 won't be intercepted and retried.
        const base = api.defaults.baseURL || "";
        const refreshResponse = await axios.post(
          // build absolute URL to refresh endpoint
          `${base.replace(/\/$/, "")}/api/auth/refresh`,
          {},
          { withCredentials: true } // send refresh cookie
        );
        const newAccessToken = refreshResponse.data?.accessToken;
        if (!newAccessToken) {
          // refresh endpoint responded but no token -> treat as failure
          return Promise.reject(error);
        }

        // update in-memory token
        setAccessToken(newAccessToken);

        // attach new token and retry original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest); // retry
      } catch (refreshErr: any) {
        // refresh failed (likely 401) -> don't loop, just reject so UI can force logout
        console.warn("Refresh failed:", refreshErr?.response?.status);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
