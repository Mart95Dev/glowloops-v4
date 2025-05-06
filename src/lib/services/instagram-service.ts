import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { convertFirestoreData } from '../utils/firestore-helpers';
import { refreshStorageUrl } from '../utils/storage-helpers';

// Collection Firestore pour les posts Instagram
const INSTAGRAM_COLLECTION = 'instagram_posts';

export interface InstagramPost {
  id: string;
  imageUrl: string;
  link: string;
  caption?: string;
  postedAt: string; // Modifié pour être une chaîne ISO au lieu d'un Timestamp
  username?: string;
  likes?: number;
  tags?: string[];
  productIds?: string[];
  isActive?: boolean;
}

/**
 * Récupère les derniers posts Instagram
 */
export const getRecentInstagramPosts = async (limitCount = 6): Promise<InstagramPost[]> => {
  try {
    const postsRef = collection(db, INSTAGRAM_COLLECTION);
    const q = query(
      postsRef,
      orderBy('postedAt', 'desc'),
      limit(limitCount)
    );
    
    const postsSnapshot = await getDocs(q);
    
    const posts: InstagramPost[] = [];
    
    for (const document of postsSnapshot.docs) {
      // Utiliser convertFirestoreData pour transformer les timestamps en chaînes ISO
      const post = convertFirestoreData<InstagramPost>({
        id: document.id,
        ...document.data()
      });
      
      // Rafraîchir l'URL de l'image
      if (post.imageUrl) {
        post.imageUrl = await refreshStorageUrl(post.imageUrl);
      }
      
      posts.push(post);
    }
    
    return posts;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts Instagram:', error);
    return [];
  }
};
