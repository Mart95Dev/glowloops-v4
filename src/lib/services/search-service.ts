import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
// import { Product } from '../types/product';
import { convertFirestoreDocToProduct } from './product-service';
import { useSearchCacheStore } from '@/lib/store/searchCacheStore';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

// Fonction pour normaliser le texte (supprimer les accents)
const normalizeText = (text: string): string => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

/**
 * Interface pour les résultats de recherche
 */
export interface SearchResult {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  currency: string;
  categoryId?: string;
  url: string;
}

/**
 * Recherche des produits par terme de recherche
 * @param searchTerm Terme de recherche
 * @param maxResults Nombre maximum de résultats
 */
export const searchProducts = async (searchTerm: string, maxResults = 5): Promise<SearchResult[]> => {
  console.log('[SEARCH] Début recherche produits avec terme:', searchTerm);
  
  if (!searchTerm || searchTerm.trim().length < 2) {
    console.log('[SEARCH] Terme trop court, retour vide');
    return [];
  }

  // Toujours normaliser le terme AVANT d'utiliser le cache
  const normalizedTerm = normalizeText(searchTerm.trim());
  console.log('[SEARCH] Terme normalisé:', normalizedTerm);
  
  const cacheKey = normalizedTerm;
  // Utiliser la clé normalisée pour le cache
  const cached = useSearchCacheStore.getState().getProductCache(cacheKey);
  if (cached) {
    console.log('[SEARCH] Résultats trouvés dans le cache:', cached.length);
    return cached.slice(0, maxResults);
  }

  try {
    console.log('[SEARCH] Récupération des produits depuis Firestore...');
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const productsQuery = query(productsRef, limit(50));
    const productsSnapshot = await getDocs(productsQuery);
    console.log('[SEARCH] Nombre de produits récupérés:', productsSnapshot.docs.length);
    
    const allProducts = productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    console.log('[SEARCH] Produits convertis:', allProducts.length);

    // Recherche avancée GlowLoops :
    console.log('[SEARCH] Début du filtrage des produits pour:', normalizedTerm);
    
    let results = allProducts.filter(product => {
      const name = product.basic_info?.name ? normalizeText(product.basic_info.name) : '';
      const tags = Array.isArray(product.basic_info?.tags) ? product.basic_info.tags.map((tag: string) => normalizeText(tag)) : [];
      const collection = product.basic_info?.collection ? normalizeText(product.basic_info.collection) : '';
      const categoryId = product.basic_info?.categoryId ? normalizeText(product.basic_info.categoryId) : '';
      const slug = product.basic_info?.slug ? normalizeText(product.basic_info.slug) : '';
      
      // Pour debug
      if (product.basic_info?.name?.toLowerCase().includes('puce') || 
          product.basic_info?.categoryId?.toLowerCase().includes('puce')) {
        console.log('[SEARCH] Produit potentiel "puce" trouvé:', {
          id: product.id,
          name: product.basic_info?.name,
          categoryId: product.basic_info?.categoryId,
          tags: product.basic_info?.tags
        });
      }

      // Recherche tolérante : nom, tags, collection, catégorie, slug
      return (
        name.includes(normalizedTerm) ||
        tags.some(tag => tag.includes(normalizedTerm)) ||
        collection.includes(normalizedTerm) ||
        categoryId.includes(normalizedTerm) ||
        slug.includes(normalizedTerm) ||
        // Tolérance singulier/pluriel
        name.includes(normalizedTerm.replace(/s$/, '')) ||
        name.includes(normalizedTerm + 's')
      );
    });
    
    console.log('[SEARCH] Nombre de résultats après filtrage initial:', results.length);

    // Fallback : si aucun résultat, retourner tous les produits dont la catégorie correspond exactement au terme (singulier/pluriel)
    if (results.length === 0) {
      console.log('[SEARCH] Aucun résultat direct, tentative de fallback sur catégorie');
      
      results = allProducts.filter(product => {
        const categoryId = product.basic_info?.categoryId ? normalizeText(product.basic_info.categoryId) : '';
        const match = (
          categoryId === normalizedTerm ||
          categoryId === normalizedTerm.replace(/s$/, '') ||
          categoryId === normalizedTerm + 's'
        );
        
        if (match) {
          console.log('[SEARCH] Match catégorie trouvé:', {
            id: product.id,
            name: product.basic_info?.name,
            categoryId: product.basic_info?.categoryId
          });
        }
        
        return match;
      });
      
      console.log('[SEARCH] Nombre de résultats après fallback catégorie:', results.length);
    }

    // Mapping strict GlowLoops
    console.log('[SEARCH] Conversion des résultats en format SearchResult');
    const mappedResults: SearchResult[] = results.slice(0, maxResults).map(product => ({
      id: product.id,
      name: product.basic_info?.name || 'Produit sans nom',
      imageUrl: product.media?.mainImageUrl,
      price: product.pricing?.regular_price || 0,
      currency: product.pricing?.currency || 'EUR',
      categoryId: product.basic_info?.categoryId,
      url: `/product/${product.basic_info?.slug || product.id}`
    }));
    
    // Stockage dans le cache (clé normalisée)
    console.log('[SEARCH] Stockage de', mappedResults.length, 'résultats dans le cache avec clé:', cacheKey);
    useSearchCacheStore.getState().setProductCache(cacheKey, mappedResults);
    
    console.log('[SEARCH] Résultats finaux:', mappedResults.map(r => ({ id: r.id, name: r.name, categoryId: r.categoryId })));
    return mappedResults;
  } catch (error) {
    console.error('Erreur lors de la recherche de produits:', error);
    return [];
  }
};

/**
 * Recherche des suggestions de produits basées sur un terme de recherche
 * @param searchTerm Terme de recherche
 * @param maxResults Nombre maximum de résultats
 */
export const getSearchSuggestions = async (searchTerm: string, maxResults = 5): Promise<SearchResult[]> => {
  // Vérifier le cache mémoire
  const cached = useSearchCacheStore.getState().getProductCache(searchTerm.trim());
  if (cached) {
    return cached.slice(0, maxResults);
  }
  // Normaliser le terme de recherche avant de le passer à searchProducts
  const normalizedTerm = normalizeText(searchTerm);
  return searchProducts(normalizedTerm, maxResults);
};

/**
 * Recherche de catégories basées sur un terme de recherche
 * @param searchTerm Terme de recherche
 * @param maxResults Nombre maximum de résultats
 */
export interface CategoryResult {
  id: string;
  name: string;
  url: string;
}

export const searchCategories = async (searchTerm: string, maxResults = 3): Promise<CategoryResult[]> => {
  console.log('[CATEGORIES] Début recherche catégories avec terme:', searchTerm);
  
  if (!searchTerm || searchTerm.trim().length < 2) {
    console.log('[CATEGORIES] Terme trop court, retour vide');
    return [];
  }

  try {
    // Normaliser le terme de recherche (supprimer les accents)
    const normalizedTerm = normalizeText(searchTerm.trim());
    console.log('[CATEGORIES] Terme normalisé:', normalizedTerm);
    
    // Essayer d'abord de récupérer les catégories depuis Firestore
    console.log('[CATEGORIES] Récupération des catégories depuis Firestore...');
    const categoriesRef = collection(db, 'categories');
    const categoriesQuery = query(categoriesRef, limit(50));
    
    try {
      const categoriesSnapshot = await getDocs(categoriesQuery);
      console.log('[CATEGORIES] Nombre de catégories récupérées:', categoriesSnapshot.docs.length);
      
      if (!categoriesSnapshot.empty) {
        console.log('[CATEGORIES] Catégories disponibles:', categoriesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
        // Filtrer les catégories dont le nom contient le terme de recherche
        const filteredCategories = categoriesSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || doc.id,
              url: `/shop?category=${doc.id}`
            };
          })
          .filter(category => 
            category.name.toLowerCase().includes(normalizedTerm)
          )
          .slice(0, maxResults);
        
        const categories: CategoryResult[] = filteredCategories;
        useSearchCacheStore.getState().setCategoryCache(searchTerm.trim(), categories);
        return categories.slice(0, maxResults);
      }
    } catch (firestoreError) {
      console.error('Erreur lors de la recherche dans Firestore:', firestoreError);
      // En cas d'erreur, on continue avec les données de navigation
    }
    
    // Utiliser les données de navigation comme solution de secours
    const { navigationData } = await import('../data/navigation-data');
    
    // Extraire toutes les catégories principales
    const mainCategories = navigationData.map(category => ({
      id: category.name.toLowerCase().replace(/\s+/g, '-'),
      name: category.name,
      url: category.href
    }));
    
    // Extraire toutes les sous-catégories
    const subCategories = navigationData
      .filter(category => category.subcategories && category.subcategories.length > 0)
      .flatMap(category => 
        (category.subcategories || []).map(subcategory => ({
          id: subcategory.href.split('/').pop() || '',
          name: subcategory.name,
          url: subcategory.href
        }))
      );
    
    // Combiner et filtrer les catégories par le terme de recherche
    const allCategories = [...mainCategories, ...subCategories];
    const filteredCategories = allCategories
      .filter(category => 
        category.name.toLowerCase().includes(normalizedTerm)
      )
      .slice(0, maxResults);
    
    const categories: CategoryResult[] = filteredCategories;
    useSearchCacheStore.getState().setCategoryCache(searchTerm.trim(), categories);
    return categories.slice(0, maxResults);
  } catch (error) {
    console.error('Erreur lors de la recherche de catégories:', error);
    return [];
  }
};

const searchService = {
  searchProducts,
  getSearchSuggestions,
  searchCategories
};

export default searchService;
