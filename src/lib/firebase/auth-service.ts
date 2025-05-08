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
  ConfirmationResult
} from 'firebase/auth';
import { auth } from './firebase-config';

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
  // Inscription d'un nouvel utilisateur
  async register({ email, password, displayName }: RegisterData): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mise à jour du profil si un nom d'affichage est fourni
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Méthode simplifiée pour l'inscription avec email/mot de passe
  async registerWithEmailPassword(email: string, password: string, displayName?: string): Promise<User> {
    return this.register({ email, password, displayName });
  },

  // Connexion d'un utilisateur existant
  async signIn({ email, password }: LoginData): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Méthode simplifiée pour la connexion avec email/mot de passe
  async loginWithEmailPassword(email: string, password: string): Promise<User> {
    return this.signIn({ email, password });
  },

  // Connexion avec Google
  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error);
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
      console.error('Erreur lors de l\'initialisation du reCAPTCHA:', error);
      throw error;
    }
  },

  // Envoyer un code de vérification par SMS
  async sendVerificationCode(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code de vérification:', error);
      throw error;
    }
  },

  // Vérifier le code SMS et se connecter
  async verifyPhoneCode(confirmationResult: ConfirmationResult, verificationCode: string): Promise<User> {
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      throw error;
    }
  },

  // Déconnexion de l'utilisateur
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Réinitialisation du mot de passe
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  },

  // Obtenir l'utilisateur courant
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
