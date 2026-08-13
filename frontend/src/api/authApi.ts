import axios from 'axios';
import { store } from '../app/store';
import { tokenRefreshed, loggedOut } from '../features/auth/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: BASE_URL });

// ── Request interceptor: attach access token ──────────────────────────────
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: refresh-on-401, with request queueing ───────────
let isRefreshing = false;
let queue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function flushQueue(error: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) {
      store.dispatch(loggedOut());
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another request already triggered a refresh — wait for it.
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      store.dispatch(tokenRefreshed(data.accessToken));
      flushQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      store.dispatch(loggedOut());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);