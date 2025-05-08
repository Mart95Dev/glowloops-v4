// Hook d'authentification Firebase
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
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
    // Définir la persistance sur LOCAL pour garder l'utilisateur connecté
    // même après fermeture du navigateur
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistance d'authentification définie sur LOCAL");
      })
      .catch((error) => {
        console.error("Erreur lors de la définition de la persistance:", error);
      });
    
    console.log("Initialisation de l'écouteur d'authentification Firebase");
    
    // Souscrire aux changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("État d'authentification changé:", user ? "Utilisateur connecté" : "Non connecté");
        if (user) {
          console.log("Informations utilisateur:", {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            providerId: user.providerData[0]?.providerId || 'inconnu'
          });
        }
        setState({ user, loading: false, error: null });
      },
      (error) => {
        console.error("Erreur d'authentification:", error);
        setState({ user: null, loading: false, error });
      }
    );

    // Vérifier l'utilisateur courant immédiatement
    const currentUser = auth.currentUser;
    console.log("Utilisateur courant lors de l'initialisation:", currentUser ? "Présent" : "Absent");

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      console.log("Nettoyage de l'écouteur d'authentification");
      unsubscribe();
    };
  }, []);

  return state;
}

// Exporter l'instance auth pour un accès direct si nécessaire
export { auth };
