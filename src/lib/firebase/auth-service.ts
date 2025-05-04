// Service d'authentification Firebase
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential
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
