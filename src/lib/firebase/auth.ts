// Hook d'authentification Firebase
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase-config';

// Interface pour le résultat du hook useAuth
interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook personnalisé pour gérer l'authentification Firebase
 * @returns {Object} Objet contenant l'utilisateur, l'état de chargement et les erreurs
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Souscrire aux changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setState({ user, loading: false, error: null });
      },
      (error) => {
        console.error('Erreur d\'authentification:', error);
        setState({ user: null, loading: false, error });
      }
    );

    // Nettoyer l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, []);

  return state;
}

// Exporter l'instance auth pour un accès direct si nécessaire
export { auth };
