/**
 * Service de gestion des sessions d'authentification
 * pour contourner les limitations de Firebase dans certains navigateurs
 */
import { User } from 'firebase/auth';
import { auth } from './firebase-config';

// Clé pour stocker les informations de session
const SESSION_KEY = 'glowloops_auth_session';
const LOCAL_STORAGE_KEY = 'glowloops_auth_persistent';

// Durée de validité des données en localStorage (7 jours)
const LOCAL_STORAGE_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms

// Interface pour l'objet de session
export interface AuthSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastAuthenticated: number; // Timestamp
  expiresAt?: number; // Timestamp d'expiration
}

/**
 * Sauvegarde les informations utilisateur dans la session
 */
export function saveUserToSession(user: User): void {
  if (!user) return;
  
  try {
    // Données de base pour la session
    const sessionData: AuthSession = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastAuthenticated: Date.now()
    };
    
    // Sauvegarder dans sessionStorage (durée de la session navigateur)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    // Pour localStorage, ajouter une date d'expiration
    const persistentData: AuthSession = {
      ...sessionData,
      expiresAt: Date.now() + LOCAL_STORAGE_EXPIRATION
    };
    
    // Sauvegarder dans localStorage (persistant mais avec expiration)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persistentData));
    
    console.log("Informations utilisateur sauvegardées en session", user.email);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la session:", error);
  }
}

/**
 * Récupère les informations utilisateur de la session
 */
export function getUserFromSession(): AuthSession | null {
  console.log("🔍 getUserFromSession - Recherche dans sessionStorage et localStorage...");
  
  try {
    // Essayer d'abord sessionStorage (préféré car plus sécurisé)
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    
    if (sessionData) {
      console.log("✅ getUserFromSession - Données trouvées dans sessionStorage");
      const parsedData = JSON.parse(sessionData) as AuthSession;
      return parsedData;
    }
    
    console.log("ℹ️ getUserFromSession - Rien dans sessionStorage, vérification du localStorage...");
    
    // Si rien en sessionStorage, essayer localStorage
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (localData) {
      console.log("✅ getUserFromSession - Données trouvées dans localStorage");
      const parsedData = JSON.parse(localData) as AuthSession;
      
      // Vérifier si les données n'ont pas expiré
      if (parsedData.expiresAt && Date.now() > parsedData.expiresAt) {
        console.log("⚠️ getUserFromSession - Données du localStorage expirées, suppression...");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return null;
      }
      
      console.log("✅ getUserFromSession - Données localStorage valides, transfert vers sessionStorage");
      // Si valides, transférer dans sessionStorage pour la session en cours
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsedData));
      
      return parsedData;
    }
    
    console.log("❌ getUserFromSession - Aucune donnée trouvée");
    return null;
  } catch (error) {
    console.error("❌ getUserFromSession - Erreur lors de la récupération:", error);
    return null;
  }
}

/**
 * Efface les données de session
 */
export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log("Session utilisateur effacée");
  } catch (error) {
    console.error("Erreur lors de la suppression de la session:", error);
  }
}

/**
 * Vérifie si l'utilisateur est authentifié (Firebase ou session)
 */
export function isAuthenticated(): boolean {
  console.log("🔍 isAuthenticated - Vérification...");
  
  // Vérifier Firebase d'abord
  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log("✅ isAuthenticated - Utilisateur Firebase trouvé:", currentUser.email);
    // Mettre à jour la session au passage
    saveUserToSession(currentUser);
    return true;
  }
  
  console.log("ℹ️ isAuthenticated - Pas d'utilisateur Firebase actif, vérification des sessions...");
  
  // Vérifier la session ensuite
  const sessionUser = getUserFromSession();
  
  if (sessionUser) {
    console.log("✅ isAuthenticated - Utilisateur trouvé en session:", sessionUser.email);
    return true;
  }
  
  console.log("❌ isAuthenticated - Aucun utilisateur authentifié trouvé");
  return false;
}

/**
 * Obtient les informations utilisateur (Firebase ou session)
 */
export function getAuthenticatedUser(): User | AuthSession | null {
  console.log("🔍 getAuthenticatedUser - Récupération...");
  
  // Vérifier Firebase d'abord
  const currentUser = auth.currentUser;
  if (currentUser) {
    console.log("✅ getAuthenticatedUser - Utilisateur Firebase retourné:", currentUser.email);
    return currentUser;
  }
  
  console.log("ℹ️ getAuthenticatedUser - Pas d'utilisateur Firebase, vérification des sessions...");
  
  // Vérifier la session ensuite
  const sessionUser = getUserFromSession();
  
  if (sessionUser) {
    console.log("✅ getAuthenticatedUser - Utilisateur session retourné:", sessionUser.email);
    return sessionUser;
  }
  
  console.log("❌ getAuthenticatedUser - Aucun utilisateur trouvé");
  return null;
} 