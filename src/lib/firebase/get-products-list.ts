import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export interface ProductListItem {
  id: string;
  name: string;
}

/**
 * Récupère la liste des produits disponibles
 * Utile pour tester les favoris
 */
export async function getProductsList(limitCount = 10): Promise<ProductListItem[]> {
  try {
    console.log("🔍 Récupération de la liste des produits...");
    
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    
    if (productsSnapshot.empty) {
      console.log("⚠️ Aucun produit trouvé dans la base de données");
      return [];
    }
    
    const products: ProductListItem[] = [];
    let count = 0;
    
    // Parcourir tous les produits trouvés
    for (const productDoc of productsSnapshot.docs) {
      if (count >= limitCount) break;
      
      const productData = productDoc.data();
      products.push({
        id: productDoc.id,
        name: productData.basic_info?.name || productData.name || `Produit ${count + 1}`
      });
      
      count++;
    }
    
    console.log(`✅ ${products.length} produits récupérés`);
    return products;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des produits:", error);
    return [];
  }
} 