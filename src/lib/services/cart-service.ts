import { collection, doc, setDoc, getDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { auth } from '@/lib/firebase/auth';
import { Cart } from '@/lib/types/cart';
import { getProductById } from './product-service';
import { convertFirestoreData } from '@/lib/utils/firestore-helpers';
import { Product } from '@/lib/types/product';

// Collection Firestore pour les paniers
const CARTS_COLLECTION = 'carts';

/**
 * Synchronise le panier local avec Firestore
 * @param cart Le panier à synchroniser
 * @returns Le panier mis à jour avec les informations de Firestore
 */
export const syncCartWithFirestore = async (cart: Cart): Promise<Cart> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    console.log('Aucun utilisateur connecté, panier stocké localement uniquement');
    return cart;
  }
  
  try {
    const userId = currentUser.uid;
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    
    // Ajouter l'ID utilisateur et les timestamps
    const updatedCart: Cart = {
      ...cart,
      userId,
      updatedAt: new Date().toISOString()
    };
    
    // Enregistrer dans Firestore
    await setDoc(cartRef, updatedCart, { merge: true });
    console.log('Panier synchronisé avec Firestore');
    
    return updatedCart;
  } catch (error) {
    console.error('Erreur lors de la synchronisation du panier:', error);
    return cart;
  }
};

/**
 * Récupère le panier d'un utilisateur depuis Firestore
 * @param userId ID de l'utilisateur
 * @returns Le panier de l'utilisateur ou null si non trouvé
 */
export const getUserCartFromFirestore = async (userId: string): Promise<Cart | null> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnapshot = await getDoc(cartRef);
    
    if (!cartSnapshot.exists()) {
      return null;
    }
    
    const cartData = cartSnapshot.data() as Record<string, unknown>;
    return convertFirestoreData<Cart>(cartData);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    return null;
  }
};

/**
 * Supprime le panier d'un utilisateur de Firestore
 * @param userId ID de l'utilisateur
 */
export const deleteUserCart = async (userId: string): Promise<void> => {
  try {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await deleteDoc(cartRef);
    console.log('Panier supprimé de Firestore');
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
  }
};

/**
 * Obtient des recommandations de produits pour le panier actuel
 * @param cart Le panier actuel
 * @param limit Nombre de recommandations à retourner
 * @returns Liste de produits recommandés
 */
export const getCartRecommendations = async (cart: Cart, limit = 4): Promise<Product[]> => {
  try {
    if (cart.items.length === 0) {
      // Si le panier est vide, retourner les produits populaires
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('status', '==', 'active'),
        where('popularity', '>', 0)
      );
      
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Product)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limit);
      
      return products;
    }
    
    // Obtenir les catégories des produits dans le panier
    const productIds = cart.items.map(item => item.productId);
    const categoryIds: Set<string> = new Set();
    
    for (const productId of productIds) {
      const product = await getProductById(productId);
      if (product && product.basic_info?.categoryId) {
        categoryIds.add(product.basic_info.categoryId);
      }
    }
    
    // Chercher des produits de catégories similaires
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('status', '==', 'active'),
      where('basic_info.categoryId', 'in', Array.from(categoryIds).slice(0, 10))
    );
    
    const querySnapshot = await getDocs(q);
    const relatedProducts = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Product)
      .filter(product => !productIds.includes(product.id)) // Exclure les produits déjà dans le panier
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
    
    return relatedProducts;
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    return [];
  }
}; 