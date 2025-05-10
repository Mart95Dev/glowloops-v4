import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { FavoriteProduct } from '@/components/account/favorite-item';

/**
 * Service pour gérer les favoris utilisateur
 */
export const favoritesService = {
  /**
   * Récupérer tous les produits favoris d'un utilisateur
   */
  async getUserFavorites(userId: string): Promise<FavoriteProduct[]> {
    try {
      console.log("🔍 Récupération des favoris pour l'utilisateur:", userId);
      
      // 1. Récupérer le document utilisateur pour obtenir les IDs des favoris
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log("⚠️ Document utilisateur non trouvé");
        return [];
      }
      
      const userData = userDoc.data();
      const favoriteIds = userData.favoriteProductIds || [];
      
      if (favoriteIds.length === 0) {
        console.log("ℹ️ Aucun favori trouvé pour cet utilisateur");
        return [];
      }
      
      console.log("✅ IDs des favoris récupérés:", favoriteIds);
      
      // 2. Récupérer les données complètes de chaque produit favori
      const products: FavoriteProduct[] = [];
      
      // On limite à des lots de 10 produits pour éviter les requêtes trop grandes
      const batchSize = 10;
      for (let i = 0; i < favoriteIds.length; i += batchSize) {
        const batch = favoriteIds.slice(i, i + batchSize);
        
        // Récupérer les produits par ID de document
        for (const productId of batch) {
          try {
            const productDocRef = doc(db, 'products', productId);
            const productDoc = await getDoc(productDocRef);
            
            if (productDoc.exists()) {
              const productData = productDoc.data();
              products.push({
                id: productDoc.id,
                name: productData.basic_info?.name || 'Produit sans nom',
                price: productData.pricing?.regular_price || 0,
                imageUrl: productData.media?.mainImageUrl || "https://placehold.co/200x200/lilas/white?text=Produit",
                slug: productData.basic_info?.slug || productDoc.id,
                isAvailable: (productData.inventory?.quantity > 0) || false
              });
            } else {
              console.log(`⚠️ Produit non trouvé: ${productId}`);
            }
          } catch (error) {
            console.error(`❌ Erreur lors de la récupération du produit ${productId}:`, error);
          }
        }
      }
      
      console.log("✅ Produits favoris récupérés:", products.length);
      return products;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des favoris:", error);
      throw error;
    }
  },
  
  /**
   * Ajouter un produit aux favoris
   */
  async addToFavorites(userId: string, productId: string) {
    try {
      console.log(`🔖 Ajout du produit ${productId} aux favoris de l'utilisateur ${userId}`);
      
      const userRef = doc(db, 'users', userId);
      
      // Utiliser arrayUnion pour éviter les doublons
      await updateDoc(userRef, {
        favoriteProductIds: arrayUnion(productId)
      });
      
      console.log("✅ Produit ajouté aux favoris avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout aux favoris:", error);
      throw error;
    }
  },
  
  /**
   * Supprimer un produit des favoris
   */
  async removeFromFavorites(userId: string, productId: string) {
    try {
      console.log(`🗑️ Suppression du produit ${productId} des favoris de l'utilisateur ${userId}`);
      
      const userRef = doc(db, 'users', userId);
      
      // Utiliser arrayRemove pour supprimer l'élément du tableau
      await updateDoc(userRef, {
        favoriteProductIds: arrayRemove(productId)
      });
      
      console.log("✅ Produit supprimé des favoris avec succès");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la suppression des favoris:", error);
      throw error;
    }
  },
  
  /**
   * Vérifier si un produit est dans les favoris
   */
  async isProductFavorite(userId: string, productId: string) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return false;
      }
      
      const userData = userDoc.data();
      const favoriteIds = userData.favoriteProductIds || [];
      
      return favoriteIds.includes(productId);
    } catch (error) {
      console.error("❌ Erreur lors de la vérification des favoris:", error);
      return false;
    }
  }
}; 