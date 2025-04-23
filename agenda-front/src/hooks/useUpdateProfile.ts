import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/profile";
import type { UserProfile } from "../types/profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
