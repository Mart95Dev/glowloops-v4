import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { /* isAuthenticated, getAuthenticatedUser, AuthSession */ } from '@/lib/firebase/auth-session';
// import { User } from 'firebase/auth';

// Type pour les données utilisateur récupérées du localStorage
// interface StoredUserData {
//   uid: string;
//   email?: string | null;
//   displayName?: string | null;
//   photoURL?: string | null;
// }

// Type pour l'utilisateur forcé (quand auth.currentUser est null mais on a une session)
// interface ForcedUser {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
//   isForced: boolean;
// }

/**
 * Hook pour gérer l'authentification requise pour accéder à une page
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 */
export function useRequireAuth(redirectPath = '/mon-compte') {
  const { user, loading, error } = useAuth();
  const [isForceAuth, setIsForceAuth] = useState(false);
  const router = useRouter();
  const redirectAttemptedRef = useRef(false);
  
  console.log("🔐 useRequireAuth - Initialisation avec user:", user, "loading:", loading, "error:", error);
  
  // Vérifier le mode force auth pour le développement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const forceAuth = sessionStorage.getItem('force_auth_bypass');
      const hasForceAuth = forceAuth === 'true';
      console.log("🔐 useRequireAuth - Vérification force_auth_bypass:", hasForceAuth);
      setIsForceAuth(hasForceAuth);
    }
  }, []);
  
  // Effet de vérification d'authentification - déclenché une seule fois quand loading est terminé
  useEffect(() => {
    // Ne rien faire pendant le chargement ou si on est en mode force auth
    if (loading) {
      console.log("⏳ useRequireAuth - Chargement en cours, attente...");
      return;
    }

    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur et qu'on n'a pas déjà tenté de rediriger
    if (!loading && !user && !isForceAuth && !redirectAttemptedRef.current) {
      console.log("⚠️ useRequireAuth - Utilisateur non authentifié, redirection vers /auth/login");
      // Marquer que nous avons tenté de rediriger pour éviter les redirections en boucle
      redirectAttemptedRef.current = true;
      const redirectTo = encodeURIComponent(redirectPath);
      router.push(`/auth/login?redirectTo=${redirectTo}`);
    } else if (!loading && user) {
      console.log("✅ useRequireAuth - Utilisateur authentifié:", user);
    }
  }, [user, loading, router, redirectPath, isForceAuth]);

  return { user, loading, error, isForceAuth };
} 