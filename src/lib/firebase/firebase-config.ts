// Configuration Firebase pour le client
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

console.log("📌 firebase-config - Initialisation du module...");

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

// Afficher les paramètres de configuration pour vérifier qu'ils sont corrects
// (en masquant les clés sensibles)
console.log("🔍 firebase-config - Paramètres de configuration:", {
  apiKey: firebaseConfig.apiKey ? "✅ défini" : "❌ manquant",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  appId: firebaseConfig.appId ? "✅ défini" : "❌ manquant"
});

console.log("🔄 firebase-config - Vérification des apps existantes...");

// Initialiser Firebase
let app;
if (!getApps().length) {
  console.log("🔄 firebase-config - Aucune app Firebase existante, création d'une nouvelle instance...");
  app = initializeApp(firebaseConfig);
} else {
  console.log("ℹ️ firebase-config - App Firebase existante, réutilisation...");
  app = getApp();
}

console.log("🔄 firebase-config - Initialisation des services Firebase...");

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Tester la connexion à Firestore 
console.log("🧪 firebase-config - Test de connexion à Firestore...");
try {
  // Accéder aux propriétés accessibles sans générer d'erreurs de linter
  console.log("🔍 Firestore initialisé avec app:", db.app.name);
  console.log("🔍 Firebase app options:", app.options);
  // Test de connectivité simple qui sera exécuté à la première requête
  console.log("🔍 Prêt à se connecter à Firestore avec projectId:", app.options.projectId);
} catch (error) {
  console.error("❌ Erreur lors du test de connexion à Firestore:", error);
}

// Configuration de l'authentification
auth.useDeviceLanguage(); // Utiliser la langue du navigateur pour les UI d'authentification

// Configurer explicitement la persistance lors de l'initialisation
if (typeof window !== 'undefined') {
  console.log("🔐 firebase-config - Configuration de la persistance locale...");
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("✅ firebase-config - Persistance locale configurée avec succès");
    })
    .catch((error) => {
      console.error("❌ firebase-config - Erreur lors de la configuration de la persistance:", error);
    });
}

// Vérifier si nous sommes en développement pour activer les émulateurs
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  console.log("🧪 firebase-config - Mode développement avec émulateurs détecté");
  try {
    // Connecter à l'émulateur d'authentification si disponible
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log("✅ firebase-config - Émulateur d'authentification connecté");
  } catch (error) {
    console.error("❌ firebase-config - Erreur lors de la connexion à l'émulateur:", error);
  }
}

// Logs pour déboguer
console.log("📊 firebase-config - Configuration Firebase initialisée:", {
  apiKeyPresent: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Ajout de logs pour vérifier la connexion
console.log("🔥 Initialisation de Firebase...");
console.log("📊 Base de données Firestore disponible:", Boolean(db));
console.log("🔐 Service d'authentification disponible:", Boolean(auth));

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

console.log("✅ firebase-config - Module complètement initialisé");

export { app, db, auth, storage };
