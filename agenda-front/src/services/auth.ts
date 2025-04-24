import apiAuth from "./apiAuth";
import type { LoginFormValues, RegisterFormValues, LoginResponse, RegisterResponse } from '../types/auth';

export const registerUser = async (
  data: RegisterFormValues
): Promise<RegisterResponse> => {
  const { confirmPassword, ...payload } = data;
  const response = await apiAuth.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const loginUser = async (
  data: LoginFormValues
): Promise<LoginResponse> => {
  const response = await apiAuth.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const logoutUser = async () => {
  await apiAuth.post("/auth/logout");
};
