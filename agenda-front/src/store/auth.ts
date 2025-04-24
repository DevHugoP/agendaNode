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
  accessToken: null,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  isAuthLoading: true,
  setIsAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),
  isRefreshing: false,
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
}));
