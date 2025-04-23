import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

import type { LoginFormValues, RegisterFormValues, LoginResponse, RegisterResponse } from '../types/auth';

export const registerUser = async (
  data: RegisterFormValues
): Promise<RegisterResponse> => {
  const { confirmPassword, ...payload } = data;
  const response = await API.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const loginUser = async (
  data: LoginFormValues
): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/auth/login", data);
  return response.data;
};
