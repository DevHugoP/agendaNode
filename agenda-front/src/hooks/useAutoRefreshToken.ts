import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

/**
 * Hook qui tente automatiquement de rafraîchir le accessToken au chargement de l'app
 * (appelé une seule fois au mount)
 */
export function useAutoRefreshToken() {
  const {
    accessToken,
    setAccessToken,
    setIsAuthLoading,
    isRefreshing,
    setIsRefreshing,
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (message: string) => {
    window.alert(message);
    setAccessToken(null);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let cancelled = false;

    setIsAuthLoading(true);
    let triedRefresh = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setIsAuthLoading(false);
        setIsRefreshing(false);
        if (import.meta.env.DEV) console.log('[DEBUG] Timeout sécurité: setIsAuthLoading(false) forcé');
        if (!accessToken && !triedRefresh) {
          handleLogout("Votre session a expiré, veuillez vous reconnecter.");
        }
      }
    }, 3000);

    if (accessToken) {
      setIsAuthLoading(false);
      clearTimeout(timeout);
      return;
    }

    // Tenter le refresh si pas de token
    if (!isRefreshing) {
      setIsRefreshing(true);
      import("../services/api").then(({ globalRefreshAccessToken }) => {
        globalRefreshAccessToken()
          .then((token) => {
            triedRefresh = true;
            if (!cancelled && token) {
              if (import.meta.env.DEV)
                console.log("[AUTH] Refresh réussi au mount");
              setAccessToken(token);
              setIsAuthLoading(false);
              setIsRefreshing(false);
              clearTimeout(timeout);
            } else if (!cancelled) {
              if (import.meta.env.DEV)
                console.warn("[AUTH] Refresh échoué (token null) au mount");
              setIsAuthLoading(false);
              setIsRefreshing(false);
              clearTimeout(timeout);
              handleLogout("Votre session a expiré, veuillez vous reconnecter.");
            }
          })
          .catch((err) => {
            triedRefresh = true;
            if (!cancelled) {
              if (import.meta.env.DEV)
                console.warn("[AUTH] Refresh échoué au mount", err);
              setIsAuthLoading(false);
              setIsRefreshing(false);
              clearTimeout(timeout);
              handleLogout(
                "Erreur réseau lors du rafraîchissement du token. Veuillez vous reconnecter."
              );
            }
          });
      });
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };

  }, []);
}
