import { db } from './firebase-config';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

/**
 * Ajoute un produit test aux favoris de l'utilisateur de test (Alice)
 */
export async function addTestFavorite() {
  try {
    console.log("🔍 Recherche de l'utilisateur test (Alice)...");
    
    // Rechercher l'utilisateur par email
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', 'alice.martin@example.com')
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      console.log("⚠️ Utilisateur test non trouvé");
      return false;
    }
    
    const userDoc = usersSnapshot.docs[0];
    console.log("✅ Utilisateur test trouvé:", userDoc.id);
    
    // ID du produit test à ajouter aux favoris (à remplacer par un ID réel)
    const testProductId = "boucle_oreille_1"; // Remplacer par un ID réel de produit
    
    // Ajouter le produit aux favoris
    await updateDoc(doc(db, 'users', userDoc.id), {
      favoriteProductIds: arrayUnion(testProductId)
    });
    
    console.log(`✅ Produit test (${testProductId}) ajouté aux favoris d'Alice`);
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du produit test aux favoris:", error);
    return false;
  }
} 