import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
};

export const useAuth = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
}));
