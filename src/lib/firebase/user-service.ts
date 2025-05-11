import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';
import { toast } from '@/lib/utils/toast';

interface UserProfileData {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  /**
   * Récupère les données utilisateur depuis Firestore
   */
  async getUserData(userId: string): Promise<UserProfileData | null> {
    try {
      // Essayer d'abord par authUserId
      const usersQuery = query(
        collection(db, 'users'),
        where('authUserId', '==', userId)
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      
      if (!usersSnapshot.empty) {
        const userData = usersSnapshot.docs[0].data() as UserProfileData;
        return userData;
      }
      
      // Si pas trouvé, chercher directement par l'ID du document
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfileData;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  }

  /**
   * Met à jour le profil utilisateur dans Firebase Auth et Firestore
   */
  async updateUserProfile(user: User, profileData: UserProfileData): Promise<boolean> {
    try {
      // Mettre à jour le profil dans Firebase Auth
      if (profileData.displayName || profileData.photoURL) {
        await updateProfile(user, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL
        });
      }
      
      // Rechercher l'utilisateur dans Firestore
      const usersQuery = query(
        collection(db, 'users'),
        where('authUserId', '==', user.uid)
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      let userDocRef;
      
      if (!usersSnapshot.empty) {
        // Utilisateur trouvé, utiliser la référence existante
        userDocRef = usersSnapshot.docs[0].ref;
      } else {
        // Créer un nouveau document utilisateur
        userDocRef = doc(db, 'users', user.uid);
      }
      
      // Préparer les données à mettre à jour
      const userData = {
        ...profileData,
        authUserId: user.uid,
        email: user.email,
        updatedAt: new Date()
      };
      
      // Mettre à jour ou créer le document utilisateur
      await setDoc(userDocRef, userData, { merge: true });
      
      toast.success('Profil mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return false;
    }
  }

  /**
   * Met à jour l'adresse email de l'utilisateur
   */
  async updateUserEmail(user: User, newEmail: string, password: string): Promise<boolean> {
    try {
      // Réauthentifier l'utilisateur avant de changer l'email
      if (user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } else {
        throw new Error('Adresse email actuelle non disponible');
      }
      
      // Mettre à jour l'email
      await updateEmail(user, newEmail);
      
      // Mettre à jour l'email dans Firestore également
      const usersQuery = query(
        collection(db, 'users'),
        where('authUserId', '==', user.uid)
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      
      if (!usersSnapshot.empty) {
        const userDocRef = usersSnapshot.docs[0].ref;
        await updateDoc(userDocRef, {
          email: newEmail,
          updatedAt: new Date()
        });
      }
      
      toast.success('Adresse email mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'email:', error);
      toast.error('Erreur lors de la mise à jour de l\'email');
      return false;
    }
  }

  /**
   * Met à jour le mot de passe de l'utilisateur
   */
  async updateUserPassword(user: User, { currentPassword, newPassword }: UpdatePasswordData): Promise<boolean> {
    try {
      // Réauthentifier l'utilisateur
      if (user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      } else {
        throw new Error('Adresse email non disponible');
      }
      
      // Mettre à jour le mot de passe
      await updatePassword(user, newPassword);
      
      toast.success('Mot de passe mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error('Erreur lors de la mise à jour du mot de passe');
      return false;
    }
  }
}

export const userService = new UserService(); 