import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

// Collection Firestore pour les avantages
const ADVANTAGES_COLLECTION = 'advantages';

export interface Advantage {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  isActive: boolean;
}

/**
 * Récupère les avantages actifs
 */
export const getActiveAdvantages = async (limitCount = 5): Promise<Advantage[]> => {
  try {
    const advantagesRef = collection(db, ADVANTAGES_COLLECTION);
    const q = query(
      advantagesRef,
      where('isActive', '==', true),
      orderBy('order', 'asc'),
      limit(limitCount)
    );
    
    const advantagesSnapshot = await getDocs(q);
    
    return advantagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Advantage));
  } catch (error) {
    console.error('Erreur lors de la récupération des avantages:', error);
    return [];
  }
};
