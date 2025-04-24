import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../services/auth';
import { useAuth } from '../store/auth';

/**
 * Hook pour déclencher la déconnexion utilisateur via React Query.
 * Fournit isLoading, isSuccess, isError, et une fonction logout().
 */
export function useLogout() {
  const { setAccessToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      setAccessToken(null);
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.status === 'pending',
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
