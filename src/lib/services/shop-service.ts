import { collection, getDocs, query, where, limit, DocumentData, QueryDocumentSnapshot, Query, WhereFilterOp } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { ProductDisplay } from '../types/product';
import { convertFirestoreDocToProduct, convertToProductDisplay } from './product-service';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

export interface FilterOptions {
  style?: string[];
  vibe?: string[];
  material?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  isNew?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popularity';
  lastVisible?: QueryDocumentSnapshot<DocumentData>;
  pageSize?: number;
}

/**
 * Récupère les produits filtrés pour la boutique
 */
export const getFilteredProducts = async (
  options: FilterOptions = {}
): Promise<{
  products: ProductDisplay[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}> => {
  try {
    const {
      style = [],
      vibe = [],
      material = [],
      priceRange,
      isNew,
      sortBy = 'price-desc', // Tri par prix décroissant par défaut
      // Nous ignorons lastVisible car nous récupérons tous les produits et filtrons en mémoire
      // lastVisible,
      pageSize = 12
    } = options;

    // Création de la requête de base
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    let q: Query<DocumentData> = query(productsRef);

    // Application des filtres
    const filters: { field: string; operator: WhereFilterOp; value: unknown }[] = [];

    // Filtrage par style (utilise les tags)
    if (style.length > 0) {
      filters.push({
        field: 'basic_info.tags',
        operator: 'array-contains-any',
        value: style
      });
    }

    // Filtrage par vibe (utilise vibes)
    if (vibe.length > 0) {
      // Nous utilisons un champ différent pour éviter les conflits avec array-contains-any
      for (const vibeValue of vibe) {
        filters.push({
          field: `vibes.${vibeValue}`,
          operator: '==',
          value: true
        });
      }
    }

    // Filtrage par matériau
    if (material.length > 0) {
      // Utiliser le bon chemin pour les matériaux
      for (const materialValue of material) {
        filters.push({
          field: `specifications.materials`,
          operator: 'array-contains',
          value: materialValue
        });
      }
    }

    // Filtrage par prix minimum
    if (priceRange?.min !== undefined) {
      filters.push({
        field: 'pricing.regular_price',
        operator: '>=',
        value: priceRange.min
      });
    }

    // Filtrage par prix maximum
    if (priceRange?.max !== undefined) {
      filters.push({
        field: 'pricing.regular_price',
        operator: '<=',
        value: priceRange.max
      });
    }

    // Filtrage par nouveauté
    if (isNew !== undefined) {
      filters.push({
        field: 'isNew',
        operator: '==',
        value: isNew
      });
    }

    // Approche simplifiée pour éviter les erreurs d'index Firestore
    console.log('Récupération des produits...');
    
    // Nous appliquons uniquement un filtre simple sur le statut pour récupérer les produits actifs
    q = query(q, where('status', '==', 'active'));
    
    // Limitation du nombre de résultats - augmentation pour avoir plus de produits
    q = query(q, limit(200));

    // Exécution de la requête
    const productsSnapshot = await getDocs(q);
    
    // Conversion des documents en objets Product
    let products = productsSnapshot.docs
      .map(doc => convertFirestoreDocToProduct(doc));
    
    // Déterminer le prix maximum pour le slider
    const maxPrice = Math.max(...products.map(p => p.pricing?.regular_price || 0));
    console.log(`Prix maximum trouvé: ${maxPrice} EUR`);
    
    // Application des filtres en mémoire
    if (filters.length > 0) {
      // Appliquer tous les filtres en mémoire car nous avons limité les filtres Firestore au minimum
      const filtersToApply = filters;
      
      products = products.filter(product => {
        // Vérifier que le produit correspond à tous les filtres
        return filtersToApply.every(filter => {
          const fieldParts = filter.field.split('.');
          let value: unknown = product;
          
          // Accéder à la valeur imbriquée (ex: basic_info.tags)
          for (const part of fieldParts) {
            if (value === undefined || value === null) return false;
            // Vérifier que value est un objet avant d'accéder à ses propriétés
            if (typeof value === 'object') {
              // Utiliser une assertion de type pour accéder à la propriété de manière sécurisée
              value = (value as Record<string, unknown>)[part];
            } else {
              return false; // Si value n'est pas un objet, on ne peut pas accéder à ses propriétés
            }
          }
          
          // Appliquer l'opérateur de comparaison
          switch (filter.operator) {
            case '==':
              return value === filter.value;
            case '!=':
              return value !== filter.value;
            case '>':
              // Vérifier que les valeurs sont comparables
              return typeof value === 'number' && typeof filter.value === 'number' ? 
                value > filter.value : false;
            case '>=':
              return typeof value === 'number' && typeof filter.value === 'number' ? 
                value >= filter.value : false;
            case '<':
              return typeof value === 'number' && typeof filter.value === 'number' ? 
                value < filter.value : false;
            case '<=':
              return typeof value === 'number' && typeof filter.value === 'number' ? 
                value <= filter.value : false;
            case 'array-contains':
              return Array.isArray(value) && value.includes(filter.value as unknown);
            case 'array-contains-any':
              return Array.isArray(value) && Array.isArray(filter.value) && 
                     filter.value.some(v => value.includes(v as unknown));
            case 'in':
              return Array.isArray(filter.value) && filter.value.includes(value as unknown);
            case 'not-in':
              return Array.isArray(filter.value) && !filter.value.includes(value as unknown);
            default:
              return false;
          }
        });
      });
    }
    
    // Appliquer le tri en mémoire
    switch (sortBy) {
      case 'newest':
        // Tri par date de création (si disponible dans basic_info) ou par nom
        products.sort((a, b) => {
          if (a.basic_info?.createdAt && b.basic_info?.createdAt) {
            // Conversion des timestamps Firestore en dates JavaScript
            const dateA = a.basic_info.createdAt.seconds ? 
              new Date(a.basic_info.createdAt.seconds * 1000) : new Date(0);
            const dateB = b.basic_info.createdAt.seconds ? 
              new Date(b.basic_info.createdAt.seconds * 1000) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } else {
            return (a.basic_info?.name || '').localeCompare(b.basic_info?.name || '');
          }
        });
        break;
      case 'price-asc':
        // Tri par prix croissant
        products.sort((a, b) => {
          const priceA = a.pricing?.regular_price || 0;
          const priceB = b.pricing?.regular_price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        // Tri par prix décroissant
        products.sort((a, b) => {
          const priceA = a.pricing?.regular_price || 0;
          const priceB = b.pricing?.regular_price || 0;
          return priceB - priceA;
        });
        break;
      case 'popularity':
        // Tri par popularité (si disponible) ou par nom
        products.sort((a, b) => {
          const popA = a.popularity || 0;
          const popB = b.popularity || 0;
          return popB - popA;
        });
        break;
      default:
        // Par défaut, tri par nom
        products.sort((a, b) => {
          return (a.basic_info?.name || '').localeCompare(b.basic_info?.name || '');
        });
    }
    
    // Appliquer la pagination après le filtrage et le tri en mémoire
    const paginatedProducts = products.slice(0, pageSize);
    const hasMore = products.length > pageSize;

    // Conversion des produits en format d'affichage
    const productDisplays = paginatedProducts.map(convertToProductDisplay);

    return {
      products: productDisplays,
      lastVisible: productsSnapshot.docs.length > 0 
        ? productsSnapshot.docs[productsSnapshot.docs.length > pageSize ? pageSize - 1 : productsSnapshot.docs.length - 1] 
        : null,
      hasMore
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des produits filtrés:', error);
    return {
      products: [],
      lastVisible: null,
      hasMore: false
    };
  }
};

/**
 * Récupère les produits par type (style, vibe, material)
 */
export const getProductsByType = async (
  type: 'style' | 'vibe' | 'material',
  value: string,
  limitCount = 12
): Promise<ProductDisplay[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    let q: Query<DocumentData>;

    switch (type) {
      case 'style':
      case 'vibe':
        // Pour style et vibe, on utilise les tags
        q = query(
          productsRef,
          where('basic_info.tags', 'array-contains', value),
          limit(limitCount)
        );
        break;
      case 'material':
        // Pour material, on utilise les matériaux
        q = query(
          productsRef,
          where('specifications.materials', 'array-contains', value),
          limit(limitCount)
        );
        break;
      default:
        throw new Error(`Type de filtre non supporté: ${type}`);
    }

    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    
    return products.map(convertToProductDisplay);
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits par ${type} (${value}):`, error);
    return [];
  }
};

/**
 * Récupère les produits par plage de prix
 */
export const getProductsByPriceRange = async (
  min: number,
  max: number,
  limitCount = 12
): Promise<ProductDisplay[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('pricing.regular_price', '>=', min),
      where('pricing.regular_price', '<=', max),
      limit(limitCount)
    );

    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    
    return products.map(convertToProductDisplay);
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits par plage de prix (${min}-${max}):`, error);
    return [];
  }
};

/**
 * Récupère le prix maximum des produits pour le slider de filtrage
 */
export const getMaxProductPrice = async (): Promise<number> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('status', '==', 'active'),
      limit(500) // Limite élevée pour avoir une bonne idée du prix maximum
    );

    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    
    // Trouver le prix maximum
    const maxPrice = Math.max(...products.map(p => p.pricing?.regular_price || 0));
    
    // Arrondir au multiple de 50 supérieur pour avoir une valeur propre
    const roundedMaxPrice = Math.ceil(maxPrice / 50) * 50;
    
    console.log(`Prix maximum trouvé: ${maxPrice} EUR, arrondi à: ${roundedMaxPrice} EUR`);
    
    return roundedMaxPrice > 0 ? roundedMaxPrice : 1000; // Valeur par défaut si aucun produit n'est trouvé
  } catch (error) {
    console.error('Erreur lors de la récupération du prix maximum:', error);
    return 1000; // Valeur par défaut en cas d'erreur
  }
};
