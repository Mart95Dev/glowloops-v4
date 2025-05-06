/**
 * Services pour interagir avec Firestore
 */

import { collection, getDocs, query, where, orderBy, limit, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { convertFirestoreData } from '../utils/firestore-helpers';
import { refreshStorageUrl } from '../utils/storage-helpers';

/**
 * Types pour les données Firestore
 */
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  type: 'hero' | 'promo' | 'collection';
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  isFrequent: boolean;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
  caption: string;
  postedAt: string;
  username: string;
  isActive: boolean;
  likes: number;
  tags: string[];
  productIds: string[];
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  isActive: boolean;
}

/**
 * Service pour les bannières
 */
export const bannerService = {
  /**
   * Récupère toutes les bannières actives
   * @param bannerType - Type de bannière à récupérer (optionnel)
   * @returns Promise avec les bannières
   */
  async getActiveBanners(bannerType?: 'hero' | 'promo' | 'collection'): Promise<Banner[]> {
    try {
      // Construire la requête
      const bannersRef = collection(db, 'banners');
      const currentDate = new Date();
      
      let bannerQuery = query(
        bannersRef,
        where('isActive', '==', true),
        where('startDate', '<=', currentDate),
        where('endDate', '>=', currentDate),
        orderBy('startDate'),
        orderBy('order')
      );
      
      // Ajouter le filtre par type si spécifié
      if (bannerType) {
        bannerQuery = query(
          bannersRef,
          where('isActive', '==', true),
          where('type', '==', bannerType),
          where('startDate', '<=', currentDate),
          where('endDate', '>=', currentDate),
          orderBy('startDate'),
          orderBy('order')
        );
      }
      
      const querySnapshot = await getDocs(bannerQuery);
      
      // Transformer les documents Firestore en objets Banner
      const banners: Banner[] = [];
      for (const document of querySnapshot.docs) {
        const data = document.data();
        const banner = convertFirestoreData<Banner>({
          id: document.id,
          ...data
        });
        
        // Rafraîchir l'URL de l'image
        if (banner.imageUrl) {
          banner.imageUrl = await refreshStorageUrl(banner.imageUrl);
        }
        
        banners.push(banner);
      }
      
      return banners;
    } catch (error) {
      console.error('Erreur lors de la récupération des bannières:', error);
      return [];
    }
  },
  
  /**
   * Récupère une bannière spécifique par son ID
   * @param id - ID de la bannière
   * @returns Promise avec la bannière ou null si non trouvée
   */
  async getBannerById(id: string): Promise<Banner | null> {
    try {
      const bannerDoc = await getDoc(doc(db, 'banners', id));
      
      if (!bannerDoc.exists()) {
        return null;
      }
      
      const data = bannerDoc.data();
      return convertFirestoreData<Banner>({
        id: bannerDoc.id,
        ...data
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération de la bannière ${id}:`, error);
      return null;
    }
  }
};

/**
 * Service pour les FAQs
 */
export const faqService = {
  /**
   * Récupère toutes les FAQs actives
   * @param category - Catégorie de FAQ à récupérer (optionnel)
   * @param frequentOnly - Si true, récupère uniquement les FAQs fréquentes
   * @returns Promise avec les FAQs
   */
  async getActiveFaqs(category?: string, frequentOnly = false): Promise<FAQ[]> {
    try {
      // Construire la requête
      const faqsRef = collection(db, 'faqs');
      
      let faqQuery = query(
        faqsRef,
        where('isActive', '==', true),
        orderBy('order')
      );
      
      // Ajouter le filtre par catégorie si spécifié
      if (category) {
        faqQuery = query(
          faqsRef,
          where('isActive', '==', true),
          where('category', '==', category),
          orderBy('order')
        );
      }
      
      // Ajouter le filtre pour les FAQs fréquentes si demandé
      if (frequentOnly) {
        faqQuery = query(
          faqsRef,
          where('isActive', '==', true),
          where('isFrequent', '==', true),
          orderBy('order')
        );
      }
      
      const querySnapshot = await getDocs(faqQuery);
      
      // Transformer les documents Firestore en objets FAQ
      const faqs: FAQ[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        faqs.push(convertFirestoreData<FAQ>({
          id: doc.id,
          ...data
        }));
      });
      
      return faqs;
    } catch (error) {
      console.error('Erreur lors de la récupération des FAQs:', error);
      return [];
    }
  }
};

/**
 * Service pour les posts Instagram
 */
export const instagramService = {
  /**
   * Récupère les posts Instagram actifs
   * @param count - Nombre de posts à récupérer (défaut: 6)
   * @returns Promise avec les posts Instagram
   */
  async getActivePosts(count = 6): Promise<InstagramPost[]> {
    try {
      // Construire la requête
      const postsRef = collection(db, 'instagram_posts');
      
      const postsQuery = query(
        postsRef,
        where('isActive', '==', true),
        orderBy('postedAt', 'desc'),
        limit(count)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      // Transformer les documents Firestore en objets InstagramPost
      const posts: InstagramPost[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        posts.push(convertFirestoreData<InstagramPost>({
          id: doc.id,
          ...data
        }));
      });
      
      return posts;
    } catch (error) {
      console.error('Erreur lors de la récupération des posts Instagram:', error);
      return [];
    }
  }
};

/**
 * Service pour les avantages
 */
export const advantageService = {
  /**
   * Récupère tous les avantages actifs
   * @returns Promise avec les avantages
   */
  async getActiveAdvantages(): Promise<Advantage[]> {
    try {
      // Construire la requête
      const advantagesRef = collection(db, 'advantages');
      
      const advantagesQuery = query(
        advantagesRef,
        where('isActive', '==', true),
        orderBy('order')
      );
      
      const querySnapshot = await getDocs(advantagesQuery);
      
      // Transformer les documents Firestore en objets Advantage
      const advantages: Advantage[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        advantages.push(convertFirestoreData<Advantage>({
          id: doc.id,
          ...data
        }));
      });
      
      return advantages;
    } catch (error) {
      console.error('Erreur lors de la récupération des avantages:', error);
      return [];
    }
  }
};
