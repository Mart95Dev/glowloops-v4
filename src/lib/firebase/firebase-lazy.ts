/**
 * Chargement différé de Firebase
 * Ce module fournit une méthode pour charger les modules Firebase uniquement lorsqu'ils sont nécessaires
 * afin d'éviter de bloquer le thread principal et d'améliorer les métriques de performance.
 */

import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Promesses pour les importations différées
let firebaseAppPromise: Promise<FirebaseApp> | null = null;
let firestorePromise: Promise<Firestore> | null = null;
let authPromise: Promise<Auth> | null = null;
let storagePromise: Promise<FirebaseStorage> | null = null;

// Instances Firebase (initialisées à la demande)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

/**
 * Initialise l'application Firebase Core de manière différée
 * @returns Promise avec l'instance Firebase App
 */
export const initFirebaseApp = async (): Promise<FirebaseApp> => {
  if (app) return app;
  
  if (!firebaseAppPromise) {
    firebaseAppPromise = import('firebase/app').then(async ({ initializeApp, getApps, getApp }) => {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      return app;
    });
  }
  
  return firebaseAppPromise;
};

/**
 * Obtient l'instance Firestore de manière différée
 * @returns Promise avec l'instance Firestore
 */
export const getFirestoreInstance = async (): Promise<Firestore> => {
  if (db) return db;
  
  if (!firestorePromise) {
    firestorePromise = initFirebaseApp().then(async (app) => {
      const { getFirestore } = await import('firebase/firestore');
      db = getFirestore(app);
      return db;
    });
  }
  
  return firestorePromise;
};

/**
 * Obtient l'instance Auth de manière différée
 * @returns Promise avec l'instance Auth
 */
export const getAuthInstance = async (): Promise<Auth> => {
  if (auth) return auth;
  
  if (!authPromise) {
    authPromise = initFirebaseApp().then(async (app) => {
      const { getAuth, browserLocalPersistence, setPersistence } = await import('firebase/auth');
      auth = getAuth(app);
      
      // Configurer la persistance
      if (typeof window !== 'undefined') {
        try {
          await setPersistence(auth, browserLocalPersistence);
        } catch (error) {
          console.error("Erreur lors de la configuration de la persistance:", error);
        }
      }
      
      return auth;
    });
  }
  
  return authPromise;
};

/**
 * Obtient l'instance Storage de manière différée
 * @returns Promise avec l'instance Storage
 */
export const getStorageInstance = async (): Promise<FirebaseStorage> => {
  if (storage) return storage;
  
  if (!storagePromise) {
    storagePromise = initFirebaseApp().then(async (app) => {
      const { getStorage } = await import('firebase/storage');
      storage = getStorage(app);
      return storage;
    });
  }
  
  return storagePromise;
};

/**
 * Récupère une URL de fichier Storage de manière différée
 * @param path Chemin du fichier dans Firebase Storage
 * @returns URL du fichier
 */
export const getStorageFileUrl = async (path: string): Promise<string> => {
  if (!path) return '';
  
  try {
    const storage = await getStorageInstance();
    const { ref, getDownloadURL } = await import('firebase/storage');
    
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fileRef = ref(storage, cleanPath);
    const url = await getDownloadURL(fileRef);
    
    return url;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'URL pour ${path}:`, error);
    
    // Fallback direct URL
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'glowloops-v3.appspot.com';
    return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media`;
  }
};

/**
 * Précharge les modules Firebase après le chargement initial de la page
 * Cela améliore la réactivité pour les interactions utilisateur futures
 */
export const preloadFirebaseModules = (): void => {
  if (typeof window !== 'undefined') {
    // Utiliser requestIdleCallback pour charger pendant les périodes d'inactivité
    const preload = () => {
      // Précharger Firebase App en premier
      initFirebaseApp().then(() => {
        // Puis précharger les autres modules
        setTimeout(() => getAuthInstance(), 2000);
        setTimeout(() => getFirestoreInstance(), 3000);
        setTimeout(() => getStorageInstance(), 4000);
      });
    };
    
    if ('requestIdleCallback' in window) {
      (window as Window).requestIdleCallback(preload, { timeout: 5000 });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas requestIdleCallback
      setTimeout(preload, 3000);
    }
  }
};

// Exportez ces fonctions pour remplacer les importations directes de firebase-config.ts 