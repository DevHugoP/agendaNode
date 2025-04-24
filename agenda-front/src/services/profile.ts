import type { UserProfile } from "../types/profile";
import API from "./api";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await API.get<UserProfile>("/profile"); // /api/profile
  return response.data;
};

export const updateProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await API.put<UserProfile>("/profile", data);
  return response.data;
};
