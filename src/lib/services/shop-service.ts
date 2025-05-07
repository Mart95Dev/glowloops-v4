import { collection, getDocs, query, where, limit, DocumentData, QueryDocumentSnapshot, Query, WhereFilterOp } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { ProductDisplay } from '../types/product';
import { convertFirestoreDocToProduct, convertToProductDisplay } from './product-service';

// Type personnalisé pour nos opérateurs de filtre étendus
type CustomFilterOp = WhereFilterOp | 'in-style' | 'in-vibe' | 'in-material';

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
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null;
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
    const filters: { field: string; operator: CustomFilterOp; value: unknown }[] = [];

    // Filtrage par style (utilise les tags)
    if (style.length > 0) {
      // On utilise un filtre simple pour les styles
      filters.push({
        field: 'style',
        operator: 'in-style' as CustomFilterOp,
        value: style
      });
    }

    // Filtrage par vibe (utilise vibes)
    if (vibe.length > 0) {
      // On utilise un filtre simple pour les vibes
      filters.push({
        field: 'vibe',
        operator: 'in-vibe' as CustomFilterOp,
        value: vibe
      });
    }

    // Filtrage par matériau
    if (material.length > 0) {
      // On utilise un filtre simple pour les matériaux
      filters.push({
        field: 'material',
        operator: 'in-material' as CustomFilterOp,
        value: material
      });
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
      const filtersToApply = filters as { field: string; operator: CustomFilterOp; value: unknown }[];
      
      // Afficher les filtres appliqués
      console.log('Filtres appliqués:', filtersToApply);
      
      // Si aucun filtre n'est appliqué, retourner tous les produits
      if (filtersToApply.length === 0) {
        return {
          products: products.map(convertToProductDisplay),
          lastVisible: productsSnapshot.docs.length > 0 ? productsSnapshot.docs[0] : null,
          hasMore: false
        };
      }
      
      // Filtrer les produits
      const filteredProducts = products.filter(product => {
        // Vérifier que le produit correspond à tous les filtres
        return filtersToApply.every(filter => {
          // Filtre de style simplifié
          if (filter.field === 'style' && filter.operator === 'in-style') {
            const tags = product.basic_info?.tags || [];
            const categoryId = product.basic_info?.categoryId || '';
            const styleValues = Array.isArray(filter.value) 
              ? filter.value as string[] 
              : [filter.value as string];
            
            // Vérifier si au moins un style correspond aux tags ou à la catégorie
            for (const style of styleValues) {
              if (typeof style !== 'string') continue;
              
              // Vérifier dans les tags
              for (const tag of tags) {
                if (typeof tag === 'string' && tag.toLowerCase() === style.toLowerCase()) {
                  return true;
                }
              }
              
              // Vérifier la catégorie
              if (categoryId.toLowerCase() === style.toLowerCase()) {
                return true;
              }
            }
            
            return false;
          }
          
          // Filtre de vibe simplifié
          if (filter.field === 'vibe' && filter.operator === 'in-vibe') {
            const vibes = product.vibes;
            const vibeValues = Array.isArray(filter.value) 
              ? filter.value as string[] 
              : [filter.value as string];
            
            // Si vibes est un objet, vérifier les propriétés
            if (typeof vibes === 'object' && vibes !== null) {
              for (const vibe of vibeValues) {
                if (typeof vibe !== 'string') continue;
                
                const vibeObj = vibes as Record<string, unknown>;
                if (vibeObj[vibe] === true) {
                  return true;
                }
              }
            }
            
            // Si vibes est un tableau, vérifier les éléments
            if (Array.isArray(vibes)) {
              for (const vibe of vibeValues) {
                if (typeof vibe === 'string' && vibes.indexOf(vibe) >= 0) {
                  return true;
                }
              }
            }
            
            return false;
          }
          
          // Filtre de matériau simplifié
          if (filter.field === 'material' && filter.operator === 'in-material') {
            const materials = product.specifications?.materials || [];
            const materialValues = Array.isArray(filter.value) 
              ? filter.value as string[] 
              : [filter.value as string];
            
            // Vérifier si au moins un matériau correspond
            for (const material of materialValues) {
              if (typeof material !== 'string') continue;
              
              for (const m of materials) {
                if (typeof m === 'string' && m.toLowerCase().includes(material.toLowerCase())) {
                  return true;
                }
              }
            }
            
            return false;
          }
          
          // Pour les autres filtres, utiliser l'approche standard
          const fieldParts = filter.field.split('.');
          let fieldValue: unknown = product;
          
          // Accéder à la valeur imbriquée (ex: basic_info.tags)
          for (const part of fieldParts) {
            if (fieldValue === undefined || fieldValue === null) return false;
            // Vérifier que fieldValue est un objet avant d'accéder à ses propriétés
            if (typeof fieldValue === 'object') {
              // Utiliser une assertion de type pour accéder à la propriété de manière sécurisée
              fieldValue = (fieldValue as Record<string, unknown>)[part];
            } else {
              return false; // Si fieldValue n'est pas un objet, on ne peut pas accéder à ses propriétés
            }
          }
          
          // Appliquer l'opérateur de comparaison
          switch (filter.operator) {
            case '==':
              return fieldValue === filter.value;
            case '!=':
              return fieldValue !== filter.value;
            case '>':
              // Vérifier que les valeurs sont comparables
              return typeof fieldValue === 'number' && typeof filter.value === 'number' ? 
                fieldValue > filter.value : false;
            case '>=':
              return typeof fieldValue === 'number' && typeof filter.value === 'number' ? 
                fieldValue >= filter.value : false;
            case '<':
              return typeof fieldValue === 'number' && typeof filter.value === 'number' ? 
                fieldValue < filter.value : false;
            case '<=':
              return typeof fieldValue === 'number' && typeof filter.value === 'number' ? 
                fieldValue <= filter.value : false;
            case 'array-contains':
              if (!Array.isArray(fieldValue)) return false;
              const arrayValue = fieldValue as unknown[];
              return arrayValue.some(item => item === filter.value);
            case 'array-contains-any':
              if (!Array.isArray(fieldValue)) return false;
              if (!Array.isArray(filter.value)) return false;
              const arrayItems = fieldValue as unknown[];
              const filterItems = filter.value as unknown[];
              return filterItems.some(item => arrayItems.includes(item));
            case 'in':
              if (!Array.isArray(filter.value)) return false;
              const inItems = filter.value as unknown[];
              return inItems.includes(fieldValue);
            case 'not-in':
              if (!Array.isArray(filter.value)) return false;
              const notInItems = filter.value as unknown[];
              return !notInItems.includes(fieldValue);
            default:
              return false;
          }
        });
      });
      
      console.log(`Nombre de produits après filtrage: ${filteredProducts.length}`);
      products = filteredProducts;
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
          const popularityA = a.popularity || 0;
          const popularityB = b.popularity || 0;
          return popularityB - popularityA;
        });
        break;
      default:
        // Tri par nom par défaut
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

    // Nous récupérons d'abord tous les produits actifs
    const productsQuery = query(
      productsRef,
      where('status', '==', 'active'),
      limit(limitCount * 5) // Nous récupérons plus de produits pour avoir suffisamment après filtrage
    );
    
    const productsSnapshot = await getDocs(productsQuery);
    let products = productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    
    // Puis nous filtrons en mémoire selon le type
    switch (type) {
      case 'style':
        // Filtrer par style (dans les tags ou la catégorie)
        products = products.filter(product => {
          const tags = product.basic_info?.tags || [];
          const categoryId = product.basic_info?.categoryId || '';
          
          // Vérifier dans les tags
          const matchesTag = tags.some(tag => 
            typeof tag === 'string' && tag.toLowerCase() === value.toLowerCase()
          );
          
          // Vérifier la catégorie
          const matchesCategory = categoryId.toLowerCase() === value.toLowerCase();
          
          return matchesTag || matchesCategory;
        });
        break;
        
      case 'vibe':
        // Filtrer par vibe
        products = products.filter(product => {
          const vibes = product.vibes;
          
          // Si vibes est un objet
          if (typeof vibes === 'object' && vibes !== null && !Array.isArray(vibes)) {
            return (vibes as Record<string, unknown>)[value] === true;
          }
          
          // Si vibes est un tableau
          if (Array.isArray(vibes)) {
            return vibes.some(v => 
              typeof v === 'string' && v.toLowerCase() === value.toLowerCase()
            );
          }
          
          return false;
        });
        break;
        
      case 'material':
        // Filtrer par matériau
        products = products.filter(product => {
          const materials = product.specifications?.materials || [];
          
          return materials.some(m => 
            typeof m === 'string' && m.toLowerCase().includes(value.toLowerCase())
          );
        });
        break;
        
      default:
        throw new Error(`Type de filtre non supporté: ${type}`);
    }

    // Limiter les résultats
    products = products.slice(0, limitCount);
    
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
    // Récupérer les produits actifs
    const priceQuery = query(
      productsRef,
      where('status', '==', 'active'),
      limit(200) // Récupérer plus de produits pour le filtrage
    );

    const priceProductsSnapshot = await getDocs(priceQuery);
    const priceFilteredProducts = priceProductsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    
    // Filtrer par plage de prix
    const filteredByPrice = priceFilteredProducts.filter(product => {
      const price = product.pricing?.regular_price || 0;
      return price >= min && price <= max;
    });
    
    // Limiter les résultats
    const limitedProducts = filteredByPrice.slice(0, limitCount);
    
    return limitedProducts.map(convertToProductDisplay);
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
    const maxPriceQuery = query(
      productsRef,
      where('status', '==', 'active'),
      limit(500) // Limite élevée pour avoir une bonne idée du prix maximum
    );

    const maxPriceSnapshot = await getDocs(maxPriceQuery);
    const maxPriceProducts = maxPriceSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
    
    // Trouver le prix maximum
    const maxPrice = Math.max(...maxPriceProducts.map((p) => p.pricing?.regular_price || 0));
    
    // Arrondir au multiple de 50 supérieur pour avoir une valeur propre
    const roundedMaxPrice = Math.ceil(maxPrice / 50) * 50;
    
    console.log(`Prix maximum trouvé: ${maxPrice} EUR, arrondi à: ${roundedMaxPrice} EUR`);
    
    return roundedMaxPrice > 0 ? roundedMaxPrice : 1000; // Valeur par défaut si aucun produit n'est trouvé
  } catch (error) {
    console.error('Erreur lors de la récupération du prix maximum:', error);
    return 1000; // Valeur par défaut en cas d'erreur
  }
};
