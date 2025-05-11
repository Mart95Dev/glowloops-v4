// Hook d'authentification Firebase
import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './firebase-config';
import { saveUserToSession, isAuthenticated, getAuthenticatedUser } from './auth-session';

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
  console.log("🔐 useAuth - Initialisation");
  
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  
  // Référence pour éviter les mises à jour multiples
  const authSetupDone = useRef(false);
  // Référence pour stocker le timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Éviter d'exécuter l'effet plusieurs fois si déjà configuré
    if (authSetupDone.current) {
      console.log("✅ useAuth - Configuration déjà effectuée, pas de reconfiguration");
      return;
    }
    
    console.log("🔄 useAuth - Effet déclenché, configuration de la persistance...");
    authSetupDone.current = true;
    
    // Définir la persistance sur LOCAL pour garder l'utilisateur connecté
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("✅ useAuth - Persistance locale configurée avec succès");
      })
      .catch((error) => {
        console.error("❌ useAuth - Erreur lors de la configuration de la persistance:", error);
      });

    console.log("🎧 useAuth - Mise en place de l'écouteur onAuthStateChanged");
    
    // Vérification initiale - voir si l'utilisateur est déjà dans localStorage
    try {
      // Si nous avons des données d'authentification dans localStorage, on passe en mode non-loading
      // jusqu'à ce que Firebase confirme l'état d'authentification
      const firebaseAuthKey = Object.keys(localStorage).find(key => 
        key.startsWith('firebase:authUser:')
      );
      
      if (firebaseAuthKey) {
        console.log("📦 useAuth - Clé d'authentification Firebase trouvée dans localStorage:", firebaseAuthKey);
      }
      
      // Vérifier aussi notre système de session personnalisé
      const customAuthData = localStorage.getItem('glowloops_auth_persistent');
      if (customAuthData) {
        console.log("📦 useAuth - Données d'authentification personnalisées trouvées");
        try {
          // Tenter de parser pour voir si c'est valide
          const authData = JSON.parse(customAuthData);
          if (authData && authData.uid && authData.email) {
            console.log("✅ useAuth - Données d'authentification valides trouvées:", authData.email);
          }
        } catch (e) {
          console.error("❌ useAuth - Erreur lors du parsing des données d'authentification:", e);
        }
      }
    } catch (error) {
      console.error("❌ useAuth - Erreur lors de la vérification initiale:", error);
    }
    
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("👤 useAuth - État d'authentification changé:", user ? `Connecté: ${user.email}` : "Déconnecté");
        
        if (user) {
          // Sauvegarder l'utilisateur dans notre système de session
          saveUserToSession(user);
          console.log("💾 useAuth - Utilisateur sauvegardé dans la session:", user.email);
          
          // Annuler le timeout s'il existe
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
        
        setState({ user, loading: false, error: null });
        console.log("✅ useAuth - État mis à jour, utilisateur:", user?.email);
      },
      (error) => {
        console.error("❌ useAuth - Erreur dans onAuthStateChanged:", error);
        setState({ user: null, loading: false, error });
        
        // Annuler le timeout s'il existe
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    );

    // Vérification supplémentaire après un court délai si aucun utilisateur n'est détecté
    timeoutRef.current = setTimeout(() => {
      console.log("⏱️ useAuth - Vérification supplémentaire après délai");
      
      // Vérifier l'état actuel du state via setState pour garantir l'accès à la dernière valeur
      setState(currentState => {
        if (currentState.loading) {
          // Tenter de récupérer l'utilisateur via notre système de session
          console.log("🔍 useAuth - Tentative de récupération via système de session");
          
          if (isAuthenticated()) {
            const sessionUser = getAuthenticatedUser();
            console.log("✅ useAuth - Utilisateur récupéré via session:", sessionUser);
            
            if (sessionUser && 'email' in sessionUser) {
              return {
                user: sessionUser as User,
                loading: false,
                error: null
              };
            }
          } else {
            console.log("❌ useAuth - Aucun utilisateur trouvé après délai supplémentaire");
            // Mettre fin au chargement si aucun utilisateur n'est trouvé
            return { ...currentState, loading: false };
          }
        }
        return currentState;
      });
    }, 2000);

    return () => {
      console.log("🧹 useAuth - Nettoyage de l'effet");
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []); // Aucune dépendance

  console.log("📊 useAuth - État actuel:", { 
    user: state.user ? `✅ (${state.user.email})` : "❌ absent",
    loading: state.loading ? "⏳ en cours" : "✅ terminé",
    error: state.error ? `❌ ${state.error.message}` : "✅ aucune"
  });

  return state;
}

// Exporter l'instance auth pour un accès direct si nécessaire
export { auth };
