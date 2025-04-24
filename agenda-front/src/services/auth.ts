import type {
  LoginFormValues,
  LoginResponse,
  RegisterFormValues,
  RegisterResponse,
} from "../types/auth";
import apiAuth from "./apiAuth";

export const registerUser = async (
  data: RegisterFormValues
): Promise<RegisterResponse> => {
  const { confirmPassword, ...payload } = data;
  const response = await apiAuth.post<RegisterResponse>(
    "/api/auth/register",
    payload
  );
  return response.data;
};

export const loginUser = async (
  data: LoginFormValues
): Promise<LoginResponse> => {
  const response = await apiAuth.post<LoginResponse>("/api/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  await apiAuth.post("/api/auth/logout");
};

// Plus de mutex ici, toute la logique de refresh est dans api.ts
export async function refreshAccessToken() {
  try {
    const res = await apiAuth.post<{ accessToken: string }>(
      "/api/auth/refresh-token",
      {},
      { withCredentials: true }
    );
    
    return res.data.accessToken;
  } catch (err) {
    
    return null;
  }
}
