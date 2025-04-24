import axios from "axios";
import { useAuth } from "../store/auth";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // pour que les cookies HttpOnly soient envoyés
});

// Intercepteur pour ajouter le header Authorization si accessToken présent
declare global {
  interface Window {
    refreshPromise?: Promise<string | null>;
  }
}

API.interceptors.request.use(
  (config) => {
    // On accède au token en mémoire Zustand
    const accessToken = useAuth.getState().accessToken;
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
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
      // Pour éviter les refresh multiples simultanés
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
      } else {
        // Échec du refresh : on force la déconnexion
        useAuth.getState().setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
