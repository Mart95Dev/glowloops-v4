// Service d'authentification Firebase
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase-config';
import { saveUserToSession, clearSession, isAuthenticated } from './auth-session';

// Interface pour les données d'inscription
interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

// Interface pour les données de connexion
interface LoginData {
  email: string;
  password: string;
}

// Service d'authentification
export const authService = {
  // Initialise l'écouteur d'état d'authentification
  initAuthListener(): () => void {
    console.log("🎧 authService - Initialisation de l'écouteur d'authentification");
    
    // Définir explicitement la persistance sur LOCAL pour garder l'utilisateur connecté
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("✅ authService - Persistance locale configurée avec succès");
      })
      .catch((error) => {
        console.error("❌ authService - Erreur lors de la configuration de la persistance:", error);
      });
    
    // Retourner l'écouteur pour suivre les changements d'état d'authentification
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ authService - Utilisateur authentifié détecté:", user.email);
        saveUserToSession(user);
      } else {
        console.log("ℹ️ authService - Aucun utilisateur authentifié détecté");
      }
    });
  },

  // Inscription d'un nouvel utilisateur
  async register({ email, password, displayName }: RegisterData): Promise<User> {
    console.log("📝 authService - Inscription en cours pour:", email);
    
    try {
      // Configurer la persistance locale
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mise à jour du profil si un nom d'affichage est fourni
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Explicitement sauvegarder dans les sessions
      saveUserToSession(userCredential.user);
      
      console.log("✅ authService - Inscription réussie pour:", email);
      return userCredential.user;
    } catch (error) {
      console.error('❌ authService - Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Inscription avec email et mot de passe
  async registerWithEmailPassword(
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> {
    console.log("🔍 authService - Tentative d'inscription avec email:", email);
    
    if (!email || !password) {
      throw new Error('Email et mot de passe requis pour l\'inscription');
    }
    
    try {
      // Configurer la persistance locale
      await setPersistence(auth, browserLocalPersistence);
      
      // Créer le compte utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ authService - Inscription réussie pour:", email);
      
      // Mettre à jour le profil avec le nom complet si fourni
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
        console.log("✅ authService - Profil mis à jour avec displayName:", displayName);
      }
      
      // Forcer un rafraîchissement du token
      if (userCredential.user) {
        await userCredential.user.getIdToken(true);
        // Sauvegarder l'utilisateur en session
        saveUserToSession(userCredential.user);
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('❌ authService - Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Connexion d'un utilisateur existant
  async signIn({ email, password }: LoginData): Promise<User> {
    console.log("🔑 authService - Connexion en cours pour:", email);
    
    try {
      // Configurer la persistance locale
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Sauvegarder l'utilisateur en session
      saveUserToSession(userCredential.user);
      
      console.log("✅ authService - Connexion réussie pour:", email);
      return userCredential.user;
    } catch (error) {
      console.error('❌ authService - Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Méthode simplifiée pour la connexion avec email/mot de passe
  async loginWithEmailPassword(email: string, password: string): Promise<User> {
    return this.signIn({ email, password });
  },

  // Connexion avec Google
  async loginWithGoogle(): Promise<User> {
    console.log("🔍 authService - Tentative de connexion avec Google...");
    
    try {
      // Configurer la persistance locale
      await setPersistence(auth, browserLocalPersistence);
      
      const provider = new GoogleAuthProvider();
      // Ajouter des paramètres pour améliorer l'expérience d'authentification Google
      provider.setCustomParameters({
        prompt: 'select_account', // Forcer la sélection du compte
      });
      
      const userCredential = await signInWithPopup(auth, provider);
      console.log("✅ authService - Connexion Google réussie pour:", userCredential.user.email);
      
      // Forcer un rafraîchissement du token pour s'assurer de la persistance
      if (userCredential.user) {
        await userCredential.user.getIdToken(true);
        // Sauvegarder l'utilisateur en session
        saveUserToSession(userCredential.user);
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('❌ authService - Erreur lors de la connexion avec Google:', error);
      throw error;
    }
  },

  // Inscription avec Google (similaire à la connexion mais avec un commentaire différent pour la clarté)
  async registerWithGoogle(): Promise<User> {
    console.log("📝 authService - Tentative d'inscription avec Google...");
    
    try {
      // La logique est similaire à loginWithGoogle car Firebase gère automatiquement
      // la création ou la récupération du compte selon que l'email existe déjà ou non
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account', // Forcer la sélection du compte
      });
      
      const userCredential = await signInWithPopup(auth, provider);
      console.log("✅ authService - Inscription Google réussie pour:", userCredential.user.email);
      
      // Forcer un rafraîchissement du token pour s'assurer de la persistance
      if (userCredential.user) {
        await userCredential.user.getIdToken(true);
        // Sauvegarder l'utilisateur en session
        saveUserToSession(userCredential.user);
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('❌ authService - Erreur lors de l\'inscription avec Google:', error);
      throw error;
    }
  },

  // Initialiser le reCAPTCHA pour l'authentification par téléphone
  initRecaptchaVerifier(containerId: string): RecaptchaVerifier {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'normal',
        callback: () => {
          // reCAPTCHA résolu, l'utilisateur peut continuer
        },
        'expired-callback': () => {
          // Le reCAPTCHA a expiré, l'utilisateur doit réessayer
        }
      });
      
      // Rendre visible le reCAPTCHA
      recaptchaVerifier.render();
      
      return recaptchaVerifier;
    } catch (error) {
      console.error('❌ authService - Erreur lors de l\'initialisation du reCAPTCHA:', error);
      throw error;
    }
  },

  // Envoyer un code de vérification par SMS
  async sendVerificationCode(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('❌ authService - Erreur lors de l\'envoi du code de vérification:', error);
      throw error;
    }
  },

  // Vérifier le code SMS et se connecter
  async verifyPhoneCode(confirmationResult: ConfirmationResult, verificationCode: string): Promise<User> {
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      // Sauvegarder explicitement l'utilisateur en session
      saveUserToSession(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('❌ authService - Erreur lors de la vérification du code:', error);
      throw error;
    }
  },

  // Déconnexion de l'utilisateur
  async signOut(): Promise<void> {
    console.log("🚪 authService - Déconnexion initiée");
    try {
      // 1. Effacer d'abord les données de session
      console.log("🧹 authService - Effacement des données de session");
      clearSession();
      
      // 2. Effacer explicitement les données de Firebase Auth dans le localStorage
      console.log("🧹 authService - Tentative d'effacement des données Firebase du localStorage");
      try {
        // Récupérer la clé exacte de Firebase (peut varier selon l'API key)
        const firebaseKeyPattern = 'firebase:authUser:';
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(firebaseKeyPattern)) {
            console.log(`🗑️ authService - Suppression clé localStorage: ${key}`);
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error("❌ authService - Erreur lors de l'effacement des données Firebase du localStorage:", error);
      }
      
      // 3. Déconnexion Firebase
      console.log("🔄 authService - Appel de firebaseSignOut");
      await firebaseSignOut(auth);
      
      console.log("✅ authService - Déconnexion réussie");
      
      // 4. Supprimer le bypass d'authentification forcée si présent
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('force_auth_bypass');
      }
    } catch (error) {
      console.error("❌ authService - Erreur lors de la déconnexion:", error);
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('❌ authService - Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  },

  // Obtenir l'utilisateur courant
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
  
  // Vérifier si l'utilisateur est connecté (via Firebase ou notre système)
  isAuthenticated(): boolean {
    return auth.currentUser !== null || isAuthenticated();
  }
};
