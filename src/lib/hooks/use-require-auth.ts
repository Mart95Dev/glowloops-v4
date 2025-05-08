import { useEffect } from 'react';
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

  useEffect(() => {
    // Ne rien faire tant que le chargement est en cours
    if (loading) return;
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!user) {
      const loginPath = '/auth/login';
      // Si un redirectTo est fourni, l'ajouter en paramètre d'URL
      const redirectPath = redirectTo ? `${loginPath}?redirectTo=${encodeURIComponent(redirectTo)}` : loginPath;
      router.push(redirectPath);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
} 