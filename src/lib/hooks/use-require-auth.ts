import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';

/**
 * Hook pour protéger les routes côté client
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * @param redirectTo URL vers laquelle rediriger après connexion
 */
export function useRequireAuth(redirectTo?: string) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Ne rien faire tant que le chargement est en cours
    if (loading) return;
    
    // Ajouter un court délai pour permettre à Firebase de récupérer l'état d'authentification persistant
    const authCheckTimeout = setTimeout(() => {
      // Si l'utilisateur n'est pas connecté après le délai, rediriger vers la page de connexion
      if (!user) {
        const loginPath = '/auth/login';
        // Si un redirectTo est fourni, l'ajouter en paramètre d'URL
        const redirectPath = redirectTo ? `${loginPath}?redirectTo=${encodeURIComponent(redirectTo)}` : loginPath;
        router.push(redirectPath);
      }
      setAuthChecked(true);
    }, 500); // Délai de 500ms pour laisser le temps à Firebase
    
    return () => clearTimeout(authCheckTimeout);
  }, [user, loading, router, redirectTo]);

  return { user, loading: loading || !authChecked };
} 