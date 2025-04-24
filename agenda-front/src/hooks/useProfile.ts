import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/profile";
import { useAuth } from "../store/auth";

export function useProfile() {
  const { accessToken, isAuthLoading } = useAuth();
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!accessToken && !isAuthLoading,
  });
}
