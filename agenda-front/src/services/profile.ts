import axios from "axios";
import type { UserProfile } from "../types/profile";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adapte si tu utilises Zustand
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProfile = async (): Promise<UserProfile> => {
  const response = await API.get<UserProfile>("/profile");
  return response.data;
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await API.put<UserProfile>("/profile", data);
  return response.data;
};
