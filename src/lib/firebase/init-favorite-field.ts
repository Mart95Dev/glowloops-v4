import { db } from './firebase-config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

/**
 * Initialise le champ favoriteProductIds dans les documents utilisateur
 * Utile pour mettre à jour la structure des documents existants
 */
export async function initializeFavoriteField() {
  try {
    console.log("🔧 Initialisation du champ favoriteProductIds pour tous les utilisateurs...");
    
    // Récupérer tous les documents utilisateur
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.empty) {
      console.log("⚠️ Aucun utilisateur trouvé dans la base de données");
      return;
    }
    
    let updatedCount = 0;
    
    // Pour chaque utilisateur, ajouter le champ s'il n'existe pas déjà
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Si le champ n'existe pas déjà
      if (!userData.favoriteProductIds) {
        await updateDoc(doc(db, 'users', userDoc.id), {
          favoriteProductIds: []
        });
        updatedCount++;
      }
    }
    
    console.log(`✅ Mise à jour terminée: ${updatedCount} utilisateurs mis à jour`);
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation du champ favoriteProductIds:", error);
  }
}

// Pour exécuter manuellement (à commenter en production)
// initializeFavoriteField(); 