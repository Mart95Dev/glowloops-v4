// Pour Next.js 13+, nous utilisons cette directive pour s'assurer que ce code
// n'est jamais inclus dans le bundle client et s'exécute uniquement côté serveur
'use server';

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Vérifier que nous sommes bien côté serveur
if (typeof window !== 'undefined') {
  throw new Error('Firebase Admin SDK ne peut être utilisé que côté serveur');
}

// Pour Next.js App Router, on peut utiliser une variable globale pour éviter
// les initialisations multiples lors des rechargements à chaud en développement
let adminAppInstance: ReturnType<typeof initializeApp> | undefined;

// Initialisation de Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  // Utiliser l'instance existante si disponible
  if (adminAppInstance) {
    return adminAppInstance;
  }

  const apps = getApps();
  
  if (!apps.length) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
      
      adminAppInstance = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      
      return adminAppInstance;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Firebase Admin:', error);
      throw error;
    }
  }
  
  adminAppInstance = apps[0];
  return adminAppInstance;
};

// Initialiser l'application Firebase Admin
const adminApp = initializeFirebaseAdmin();

// Exporter les services Firebase Admin
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);

export default adminApp;
