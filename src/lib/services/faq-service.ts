import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { convertFirestoreData } from '../utils/firestore-helpers';

// Collection Firestore pour les FAQs
const FAQ_COLLECTION = 'faqs';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  isFrequent?: boolean;
  createdAt?: string; // Timestamp converti en chaîne ISO
  updatedAt?: string; // Timestamp converti en chaîne ISO
}

/**
 * Récupère les FAQs par catégorie
 */
export const getFaqsByCategory = async (category: string, limitCount = 10): Promise<FaqItem[]> => {
  try {
    const faqsRef = collection(db, FAQ_COLLECTION);
    const q = query(
      faqsRef,
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('order', 'asc'),
      limit(limitCount)
    );
    
    const faqsSnapshot = await getDocs(q);
    
    return faqsSnapshot.docs.map(doc => {
      // Utiliser convertFirestoreData pour transformer les timestamps en chaînes ISO
      return convertFirestoreData<FaqItem>({
        id: doc.id,
        ...doc.data()
      });
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des FAQs de la catégorie ${category}:`, error);
    return [];
  }
};

/**
 * Récupère les FAQs les plus fréquentes
 */
export const getFrequentFaqs = async (limitCount = 5): Promise<FaqItem[]> => {
  try {
    const faqsRef = collection(db, FAQ_COLLECTION);
    const q = query(
      faqsRef,
      where('isActive', '==', true),
      where('isFrequent', '==', true),
      orderBy('order', 'asc'),
      limit(limitCount)
    );
    
    const faqsSnapshot = await getDocs(q);
    
    return faqsSnapshot.docs.map(doc => {
      // Utiliser convertFirestoreData pour transformer les timestamps en chaînes ISO
      return convertFirestoreData<FaqItem>({
        id: doc.id,
        ...doc.data()
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des FAQs fréquentes:', error);
    return [];
  }
};
