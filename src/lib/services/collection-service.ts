import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { convertFirestoreData } from '../utils/firestore-helpers';
import { refreshStorageUrl } from '../utils/storage-helpers';

// Collection Firestore pour les collections
const COLLECTIONS_COLLECTION = 'collections';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string; // Pour la compatibilité avec le reste de l'application
  image?: string;    // Champ réel dans Firestore
  description?: string;
  isActive: boolean;
  order?: number;
}

/**
 * Récupère toutes les collections actives
 */
export const getActiveCollections = async (limitCount = 6): Promise<Collection[]> => {
  try {
    const collectionsRef = collection(db, COLLECTIONS_COLLECTION);
    const q = query(
      collectionsRef,
      limit(limitCount)
    );
    
    const collectionsSnapshot = await getDocs(q);
    
    // Transformer les documents Firestore en objets Collection
    const collections: Collection[] = [];
    
    console.log('Nombre de collections trouvées:', collectionsSnapshot.docs.length);
    
    for (const document of collectionsSnapshot.docs) {
      const data = document.data();
      console.log('Collection brute:', document.id, data);
      
      // Ne garder que les collections actives
      if (!data.isActive) {
        console.log('Collection inactive ignorée:', document.id);
        continue;
      }
      
      // Convertir les timestamps et autres types complexes
      const collectionData = convertFirestoreData<Collection>({
        id: document.id,
        ...data
      });
      
      console.log('Collection après conversion:', collectionData);
      
      // Gérer le champ image vs imageUrl
      if (collectionData.image && !collectionData.imageUrl) {
        console.log('Utilisation du champ image pour', document.id, collectionData.image);
        collectionData.imageUrl = collectionData.image;
      }
      
      // Rafraîchir l'URL de l'image
      if (collectionData.imageUrl) {
        console.log('URL d\'image avant rafraîchissement:', collectionData.imageUrl);
        collectionData.imageUrl = await refreshStorageUrl(collectionData.imageUrl);
        console.log('URL d\'image après rafraîchissement:', collectionData.imageUrl);
      } else {
        console.error('Aucune URL d\'image trouvée pour la collection:', document.id);
      }
      
      collections.push(collectionData);
    }
    
    // Trier les collections par ordre
    return collections.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Erreur lors de la récupération des collections:', error);
    return [];
  }
};

/**
 * Récupère une collection par son slug
 */
export const getCollectionBySlug = async (slug: string): Promise<Collection | null> => {
  try {
    const collectionsRef = collection(db, COLLECTIONS_COLLECTION);
    const collectionsSnapshot = await getDocs(collectionsRef);
    
    const collectionDoc = collectionsSnapshot.docs.find(
      doc => doc.data().slug === slug && doc.data().isActive
    );
    
    if (!collectionDoc) {
      return null;
    }
    
    // Convertir les timestamps et autres types complexes
    const collectionData = convertFirestoreData<Collection>({
      id: collectionDoc.id,
      ...collectionDoc.data()
    });
    
    console.log('Collection par slug après conversion:', collectionData);
    
    // Gérer le champ image vs imageUrl
    if (collectionData.image && !collectionData.imageUrl) {
      console.log('Utilisation du champ image pour', collectionDoc.id, collectionData.image);
      collectionData.imageUrl = collectionData.image;
    }
    
    // Rafraîchir l'URL de l'image
    if (collectionData.imageUrl) {
      console.log('URL d\'image avant rafraîchissement:', collectionData.imageUrl);
      collectionData.imageUrl = await refreshStorageUrl(collectionData.imageUrl);
      console.log('URL d\'image après rafraîchissement:', collectionData.imageUrl);
    } else {
      console.error('Aucune URL d\'image trouvée pour la collection:', collectionDoc.id);
    }
    
    return collectionData;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la collection ${slug}:`, error);
    return null;
  }
};
