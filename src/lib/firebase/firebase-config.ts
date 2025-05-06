// Configuration Firebase pour le client
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Configuration Firebase avec les variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

/**
 * Génère une URL publique pour un fichier dans Firebase Storage
 * @param path - Chemin du fichier dans Firebase Storage
 * @returns Promise avec l'URL publique
 */
export const getStorageFileUrl = async (path: string): Promise<string> => {
  if (!path) {
    console.error('Chemin de fichier manquant');
    return '';
  }

  try {
    // Nettoyer le chemin si nécessaire (supprimer les éventuels slashes au début)
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Créer une référence au fichier dans Firebase Storage
    const fileRef = ref(storage, cleanPath);
    
    // Générer l'URL de téléchargement
    const url = await getDownloadURL(fileRef);
    
    console.log(`URL générée pour ${cleanPath}:`, url);
    return url;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'URL pour ${path}:`, error);
    
    // Essayer de construire une URL directe en dernier recours
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'glowloops-v3.appspot.com';
    const directUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media`;
    
    console.warn(`Utilisation d'une URL directe pour ${path}:`, directUrl);
    return directUrl;
  }
};

export { app, db, auth, storage };
