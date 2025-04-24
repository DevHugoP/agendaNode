import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  isAuthLoading: boolean;
  setIsAuthLoading: (isLoading: boolean) => void;
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  setAccessToken: (accessToken) => {
    set({ accessToken });
    if (typeof window !== 'undefined') {
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  },
  isAuthLoading: true,
  setIsAuthLoading: (isLoading) => {
    set({ isAuthLoading: isLoading });
    if (!isLoading && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:loading:done'));
    }
  },
  isRefreshing: false,
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
}));
