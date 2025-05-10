import { collection, doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { User } from 'firebase/auth';

/**
 * Service pour gérer les utilisateurs dans Firestore
 */
export const userService = {
  /**
   * Crée un nouveau document utilisateur dans Firestore après l'inscription
   */
  async createUserDocument(user: User, additionalData?: { 
    firstName?: string; 
    lastName?: string;
    phoneNumber?: string | null;
  }): Promise<string> {
    if (!user) throw new Error("Aucun utilisateur fourni");

    try {
      console.log("🔧 Création du document utilisateur dans Firestore:", user.email);
      
      // Extraire le prénom et le nom si disponible dans displayName
      const nameParts = user.displayName ? user.displayName.split(' ') : [];
      const firstName = additionalData?.firstName || nameParts[0] || '';
      const lastName = additionalData?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
      
      // Préparer les données utilisateur de base
      const userData = {
        authUserId: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: user.displayName || `${firstName} ${lastName}`.trim(),
        avatarUrl: user.photoURL,
        phoneNumber: additionalData?.phoneNumber || user.phoneNumber || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        favoriteProductIds: [],
        shippingAddresses: [],
        billingAddress: null,
      };
      
      // Créer un document avec l'ID utilisateur Firebase ou générer un nouvel ID
      const userRef = doc(collection(db, 'users'));
      await setDoc(userRef, userData);
      
      console.log("✅ Document utilisateur créé avec succès:", userRef.id);
      return userRef.id;
    } catch (error) {
      console.error("❌ Erreur lors de la création du document utilisateur:", error);
      throw error;
    }
  },

  /**
   * Vérifie si un document utilisateur existe déjà dans Firestore
   */
  async userDocumentExists(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists();
    } catch (error) {
      console.error("❌ Erreur lors de la vérification du document utilisateur:", error);
      return false;
    }
  }
}; 