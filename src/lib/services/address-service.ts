import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { v4 as uuidv4 } from 'uuid';
import { UserAddress } from '@/lib/store/user-store';

export const addressService = {
  /**
   * Récupère les adresses d'un utilisateur depuis Firestore
   */
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const userData = userDoc.data();
      return userData.addresses || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      throw error;
    }
  },
  
  /**
   * Ajoute une nouvelle adresse pour un utilisateur
   */
  async addAddress(userId: string, address: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    try {
      const newAddress: UserAddress = {
        ...address,
        id: uuidv4(),
      };
      
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Si c'est la première adresse ou si l'adresse est marquée comme par défaut
      if (newAddress.isDefault) {
        // Mettre à jour toutes les adresses existantes pour les marquer comme non par défaut
        const userData = userDoc.data();
        const addresses = userData.addresses || [];
        
        if (addresses.length > 0) {
          const updatedAddresses = addresses.map((addr: UserAddress) => ({
            ...addr,
            isDefault: false
          }));
          
          await updateDoc(userDocRef, {
            addresses: [...updatedAddresses, newAddress]
          });
        } else {
          await updateDoc(userDocRef, {
            addresses: arrayUnion(newAddress)
          });
        }
      } else {
        await updateDoc(userDocRef, {
          addresses: arrayUnion(newAddress)
        });
      }
      
      return newAddress;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour une adresse existante
   */
  async updateAddress(userId: string, updatedAddress: UserAddress): Promise<UserAddress> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const userData = userDoc.data();
      let addresses = userData.addresses || [];
      
      // Trouver l'index de l'adresse à mettre à jour
      const addressIndex = addresses.findIndex((addr: UserAddress) => addr.id === updatedAddress.id);
      
      if (addressIndex === -1) {
        throw new Error('Adresse non trouvée');
      }
      
      // Si l'adresse mise à jour est définie comme par défaut
      if (updatedAddress.isDefault) {
        // Mettre à jour toutes les adresses pour enlever le statut par défaut
        addresses = addresses.map((addr: UserAddress) => ({
          ...addr,
          isDefault: addr.id === updatedAddress.id
        }));
      } else {
        // Sinon, mettre à jour juste cette adresse
        addresses[addressIndex] = updatedAddress;
      }
      
      await updateDoc(userDocRef, { addresses });
      
      return updatedAddress;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse:', error);
      throw error;
    }
  },
  
  /**
   * Supprime une adresse
   */
  async removeAddress(userId: string, addressId: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const userData = userDoc.data();
      let addresses = userData.addresses || [];
      
      // Trouver l'adresse à supprimer
      const addressToRemove = addresses.find((addr: UserAddress) => addr.id === addressId);
      
      if (!addressToRemove) {
        throw new Error('Adresse non trouvée');
      }
      
      // Supprimer l'adresse
      addresses = addresses.filter((addr: UserAddress) => addr.id !== addressId);
      
      // Si l'adresse supprimée était celle par défaut et qu'il reste des adresses,
      // définir la première comme adresse par défaut
      if (addressToRemove.isDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }
      
      await updateDoc(userDocRef, { addresses });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'adresse:', error);
      throw error;
    }
  },
  
  /**
   * Définit une adresse comme adresse par défaut
   */
  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const userData = userDoc.data();
      const addresses = userData.addresses || [];
      
      // Mettre à jour toutes les adresses pour définir la bonne comme par défaut
      const updatedAddresses = addresses.map((addr: UserAddress) => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      await updateDoc(userDocRef, { addresses: updatedAddresses });
    } catch (error) {
      console.error('Erreur lors de la définition de l\'adresse par défaut:', error);
      throw error;
    }
  }
}; 