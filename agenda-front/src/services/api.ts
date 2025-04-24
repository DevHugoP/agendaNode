import axios from "axios";
import { useAuth } from "../store/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // pour que les cookies HttpOnly soient envoyés
});

// Intercepteur pour ajouter le header Authorization si accessToken présent
declare global {
  interface Window {
    refreshPromise?: Promise<string | null>;
  }
}

API.interceptors.request.use(
  async (config) => {
    const accessToken = useAuth.getState().accessToken;
    const isAuthLoading = useAuth.getState().isAuthLoading;
    // Bloquer toute requête API (hors refresh) tant que l'auth est en cours
    if (
      isAuthLoading &&
      !(config.url && config.url.includes("/auth/refresh-token"))
    ) {
      // Attendre que l'auth soit terminée via un événement custom
      await new Promise((resolve) => {
        const handler = () => {
          window.removeEventListener('auth:loading:done', handler);
          resolve(true);
        };
        window.addEventListener('auth:loading:done', handler);
      });
    }
    if (accessToken && config.url && config.url.startsWith("/protected")) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    if (
      config.url &&
      config.url.includes("/auth/refresh-token") &&
      import.meta.env.DEV
    ) {
      
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer le refresh automatique
enum AuthError {
  TokenExpired = "TOKEN_EXPIRED",
}

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401, on tente un refresh automatique
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (import.meta.env.DEV)
        
      // Mutex global partagé avec le hook
      if (!window.refreshPromise) {
        window.refreshPromise = API.post<{ accessToken: string }>(
          "/auth/refresh-token"
        )
          .then((res) => {
            useAuth.getState().setAccessToken(res.data.accessToken);
            return res.data.accessToken;
          })
          .catch(() => {
            useAuth.getState().setAccessToken(null);
            return null;
          })
          .finally(() => {
            window.refreshPromise = undefined;
          });
      }
      const newToken = await window.refreshPromise;
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return API(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Mutex global accessible pour le hook useAutoRefreshToken
export async function globalRefreshAccessToken() {
  if (!window.refreshPromise) {
    window.refreshPromise = API.post<{ accessToken: string }>(
      "/auth/refresh-token"
    )
      .then((res) => {
        useAuth.getState().setAccessToken(res.data.accessToken);
        return res.data.accessToken;
      })
      .catch(() => {
        useAuth.getState().setAccessToken(null);
        return null;
      })
      .finally(() => {
        window.refreshPromise = undefined;
      });
  }
  return window.refreshPromise;
}

export default API;
