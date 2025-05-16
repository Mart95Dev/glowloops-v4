import { collection, query, where, getDocs, orderBy, limit, getDoc, doc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { Product } from '@/lib/types/product';

export interface CategoryFeature {
  icon: string;
  title: string;
  description: string;
}

export interface CategoryInfo {
  name: string;
  description: string;
  imageUrl: string;
  features?: CategoryFeature[];
  parentCategoryId?: string;
  slug?: string;
  order?: number;
}

export interface CategoryData {
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  parentCategoryId?: string;
  order?: number;
  features?: CategoryFeature[];
  imagePath?: string;
  active?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Récupère les informations d'une catégorie spécifique depuis Firestore
 */
export const getCategoryInfo = async (categoryType: string, subcategory?: string): Promise<CategoryInfo> => {
  try {
    // Si une sous-catégorie est spécifiée, on essaie de la récupérer directement
    if (subcategory) {
      const subcategoryDoc = await getDoc(doc(db, 'categories', subcategory));
      
      if (subcategoryDoc.exists()) {
        const data = subcategoryDoc.data();
        return {
          name: data.name || 'Catégorie',
          description: data.description || 'Découvrez notre sélection de bijoux.',
          imageUrl: data.imageUrl || '/images/categories/default-header.jpg',
          features: data.features || getDefaultFeatures(categoryType),
          parentCategoryId: data.parentCategoryId,
          slug: data.slug,
          order: data.order
        };
      }
    }
    
    // Sinon, on récupère la catégorie principale
    const mainCategoryQuery = query(
      collection(db, 'categories'),
      where('slug', '==', categoryType)
    );
    
    const mainCategorySnapshot = await getDocs(mainCategoryQuery);
    
    if (!mainCategorySnapshot.empty) {
      const data = mainCategorySnapshot.docs[0].data();
      return {
        name: data.name || 'Catégorie',
        description: data.description || 'Découvrez notre sélection de bijoux.',
        imageUrl: data.imageUrl || '/images/categories/default-header.jpg',
        features: data.features || getDefaultFeatures(categoryType),
        parentCategoryId: data.parentCategoryId,
        slug: data.slug,
        order: data.order
      };
    }
    
    // En cas d'échec, retourner des informations par défaut
    return {
      name: categoryType === 'style' ? 'Trouvez votre style' : 
            categoryType === 'vibe' ? 'Trouvez votre vibe' : 
            'Explorez nos matériaux',
      description: 'Découvrez notre sélection de bijoux.',
      imageUrl: `/images/categories/${categoryType}-header.jpg`,
      features: getDefaultFeatures(categoryType)
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de catégorie:', error);
    
    // En cas d'erreur, retourner des informations par défaut
    return {
      name: categoryType === 'style' ? 'Trouvez votre style' : 
            categoryType === 'vibe' ? 'Trouvez votre vibe' : 
            'Explorez nos matériaux',
      description: 'Découvrez notre sélection de bijoux.',
      imageUrl: `/images/categories/${categoryType}-header.jpg`,
      features: getDefaultFeatures(categoryType)
    };
  }
};

/**
 * Retourne les caractéristiques par défaut pour une catégorie
 */
const getDefaultFeatures = (categoryType: string): CategoryFeature[] => {
  switch (categoryType) {
    case 'style':
      return [
        {
          icon: '✨',
          title: 'Variété',
          description: 'Des dizaines de styles différents pour toutes les occasions'
        },
        {
          icon: '👑',
          title: 'Qualité',
          description: 'Matériaux soigneusement sélectionnés pour chaque style'
        },
        {
          icon: '💎',
          title: 'Originalité',
          description: 'Des designs uniques qui vous démarqueront'
        }
      ];
    case 'vibe':
      return [
        {
          icon: '🔮',
          title: 'Expression',
          description: 'Des bijoux qui reflètent votre personnalité'
        },
        {
          icon: '✨',
          title: 'Tendance',
          description: 'Des vibes actuelles inspirées des dernières tendances'
        },
        {
          icon: '💫',
          title: 'Diversité',
          description: 'Une vibe pour chaque humeur et chaque occasion'
        }
      ];
    case 'material':
    case 'materiaux':
      return [
        {
          icon: '🌿',
          title: 'Qualité',
          description: 'Des matériaux premium pour une durabilité maximale'
        },
        {
          icon: '🔎',
          title: 'Diversité',
          description: 'Une large gamme de matériaux pour tous les goûts'
        },
        {
          icon: '✨',
          title: 'Innovation',
          description: 'Des matériaux traditionnels aux plus innovants'
        }
      ];
    default:
      return [
        {
          icon: '✨',
          title: 'Qualité',
          description: 'Des matériaux soigneusement sélectionnés'
        },
        {
          icon: '🎨',
          title: 'Design',
          description: 'Des créations uniques et tendances'
        },
        {
          icon: '💝',
          title: 'Satisfaction',
          description: 'Des bijoux qui vous feront plaisir'
        }
      ];
  }
};

/**
 * Récupère les sous-catégories d'une catégorie principale
 */
export const getSubcategories = async (parentCategory: string): Promise<CategoryInfo[]> => {
  try {
    const subcategoriesQuery = query(
      collection(db, 'categories'),
      where('parentCategoryId', '==', parentCategory),
      orderBy('order', 'asc')
    );
    
    const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
    
    if (subcategoriesSnapshot.empty) {
      return [];
    }
    
    return subcategoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name: data.name || doc.id,
        description: data.description || '',
        imageUrl: data.imageUrl || `/images/categories/${doc.id}.jpg`,
        parentCategoryId: data.parentCategoryId,
        slug: data.slug || doc.id,
        order: data.order
      };
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des sous-catégories pour ${parentCategory}:`, error);
    return [];
  }
};

/**
 * Récupère les produits par catégorie de style (créoles, mini-hoops, etc.)
 */
export const getProductsByStyle = async (style: string): Promise<Product[]> => {
  try {
    console.log(`Recherche des produits pour le style: ${style}`);
    
    // Normaliser le style: créer des variantes avec et sans accents
    const styleVariants = [
      style.toLowerCase(),
      style.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Sans accents
    ];
    
    // Ajouter des variantes spécifiques si nécessaire
    if (style.toLowerCase() === 'créoles' || style.toLowerCase() === 'creoles') {
      styleVariants.push('créoles');
      styleVariants.push('creoles');
    }
    
    console.log(`Variantes de recherche: ${styleVariants.join(', ')}`);
    
    const productsRef = collection(db, 'products');
    // Approche plus robuste : récupérer tous les produits actifs d'abord
    const q = query(
      productsRef,
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Nombre total de produits actifs: ${querySnapshot.size}`);
    
    // Filtrer manuellement pour trouver les produits correspondant au style
    const styleProducts: Product[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      let isMatchingProduct = false;
      
      // 1. Vérifier dans basic_info.categoryId (méthode originale)
      const basicInfoCategoryId = data.basic_info?.categoryId || '';
      if (styleVariants.includes(basicInfoCategoryId.toLowerCase())) {
        isMatchingProduct = true;
      }
      
      // 2. Vérifier le categoryId directement (s'il existe à la racine)
      const categoryId = data.categoryId || '';
      if (!isMatchingProduct && styleVariants.includes(categoryId.toLowerCase())) {
        isMatchingProduct = true;
      }
      
      // 3. Vérifier dans les tags
      if (!isMatchingProduct && Array.isArray(data.basic_info?.tags)) {
        const tags = data.basic_info.tags;
        for (const tag of tags) {
          if (typeof tag === 'string' && styleVariants.includes(tag.toLowerCase())) {
            isMatchingProduct = true;
            break;
          }
        }
      }
      
      // 4. Vérifier dans le champ styles (s'il existe)
      if (!isMatchingProduct && data.styles) {
        if (Array.isArray(data.styles)) {
          for (const s of data.styles) {
            if (typeof s === 'string' && styleVariants.includes(s.toLowerCase())) {
              isMatchingProduct = true;
              break;
            }
          }
        } else if (typeof data.styles === 'object' && data.styles !== null) {
          const stylesObj = data.styles as Record<string, unknown>;
          for (const key of Object.keys(stylesObj)) {
            if (styleVariants.includes(key.toLowerCase()) && stylesObj[key] === true) {
              isMatchingProduct = true;
              break;
            }
          }
        }
      }
      
      // Pour débogage, journaliser les produits dont l'ID contient le style
      if (doc.id.toLowerCase().includes('creole')) {
        console.log(`Analyse produit ${doc.id}:`, {
          categoryId: data.categoryId,
          basicInfoCategoryId: data.basic_info?.categoryId,
          tags: data.basic_info?.tags,
          hasStyle: isMatchingProduct
        });
      }
      
      if (isMatchingProduct) {
        styleProducts.push(formatProductData(doc.id, data));
      }
    });
    
    console.log(`Nombre de produits trouvés pour le style "${style}": ${styleProducts.length}`);
    
    return styleProducts;
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits pour le style ${style}:`, error);
    return [];
  }
};

/**
 * Récupère les produits par catégorie de vibe (chic, bold, etc.)
 */
export const getProductsByVibe = async (vibe: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    // Puisque les vibes peuvent être stockées dans la structure vibes[vibe] = true
    // ou dans basic_info.tags, nous faisons une requête simple et filtrons en mémoire
    const q = query(
      productsRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Filtrer en mémoire pour trouver les produits correspondant à la vibe
    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return { doc, data };
      })
      .filter((item) => {
        // Vérifier dans basic_info.tags
        const tags = item.data.basic_info?.tags || [];
        if (Array.isArray(tags) && tags.some(tag => tag.toLowerCase() === vibe.toLowerCase())) {
          return true;
        }
        
        // Vérifier dans vibes
        const vibes = item.data.vibes;
        if (vibes && typeof vibes === 'object' && vibes[vibe] === true) {
          return true;
        }
        
        return false;
      })
      .map((item) => formatProductData(item.doc.id, item.data));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par vibe:', error);
    return [];
  }
};

/**
 * Récupère les produits par matériau
 */
export const getProductsByMaterial = async (material: string): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    // Puisque les matériaux peuvent être stockés dans specifications.materials
    // nous faisons une requête simple et filtrons en mémoire
    const q = query(
      productsRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Filtrer en mémoire pour trouver les produits correspondant au matériau
    return querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return { doc, data };
      })
      .filter((item) => {
        // Vérifier dans specifications.materials
        const materials = item.data.specifications?.materials || [];
        if (Array.isArray(materials)) {
          return materials.some(mat => 
            typeof mat === 'string' && mat.toLowerCase().includes(material.toLowerCase())
          );
        }
        
        // Si materials est un objet, vérifier ses valeurs
        if (typeof materials === 'object' && materials !== null) {
          return Object.values(materials).some(mat => 
            typeof mat === 'string' && mat.toLowerCase().includes(material.toLowerCase())
          );
        }
        
        return false;
      })
      .map((item) => formatProductData(item.doc.id, item.data));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par matériau:', error);
    return [];
  }
};

/**
 * Récupère les produits pour une catégorie principale (style, vibe, matériau)
 */
export const getProductsByMainCategory = async (categoryType: 'style' | 'vibe' | 'material', limitCount = 12): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    
    // Pour la page principale, nous récupérons les produits et filtrons en mémoire
    const q = query(
      productsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount * 3)  // Récupérer plus de produits pour avoir assez après filtrage
    );
    
    const querySnapshot = await getDocs(q);
    const allProducts = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { doc, data };
    });
    
    let filteredProducts: Product[] = [];
    
    switch (categoryType) {
      case 'style':
        // Filtrer par categoryId
        filteredProducts = allProducts
          .filter(item => {
            const categoryId = item.data.basic_info?.categoryId || '';
            const styleCategories = ['creoles', 'mini-hoops', 'ear-cuffs', 'pendants', 'studs'];
            return styleCategories.includes(categoryId.toLowerCase());
          })
          .map(item => formatProductData(item.doc.id, item.data));
        break;
        
      case 'vibe':
        // Filtrer par tags ou vibes
        filteredProducts = allProducts
          .filter(item => {
            // Vérifier les tags
            const tags = item.data.basic_info?.tags || [];
            if (Array.isArray(tags) && tags.some(tag => 
              ['chic', 'bold', 'casual', 'boheme', 'minimaliste', 'vintage'].includes(tag.toLowerCase())
            )) {
              return true;
            }
            
            // Vérifier les vibes
            const vibes = item.data.vibes;
            if (vibes && typeof vibes === 'object') {
              return Object.keys(vibes).some(vibe => 
                ['chic', 'bold', 'casual', 'boheme', 'minimaliste', 'vintage'].includes(vibe.toLowerCase())
              );
            }
            
            return false;
          })
          .map(item => formatProductData(item.doc.id, item.data));
        break;
        
      case 'material':
        // Filtrer par matériaux
        filteredProducts = allProducts
          .filter(item => {
            const materials = item.data.specifications?.materials || [];
            const materialList = ['resine', 'acier', 'plaque or', 'argent', 'perles', 'pierres naturelles'];
            
            if (Array.isArray(materials)) {
              return materials.some(mat => {
                if (typeof mat !== 'string') return false;
                return materialList.some(m => mat.toLowerCase().includes(m));
              });
            }
            
            if (typeof materials === 'object' && materials !== null) {
              return Object.values(materials).some(mat => {
                if (typeof mat !== 'string') return false;
                return materialList.some(m => mat.toLowerCase().includes(m));
              });
            }
            
            return false;
          })
          .map(item => formatProductData(item.doc.id, item.data));
        break;
        
      default:
        filteredProducts = allProducts.map(item => formatProductData(item.doc.id, item.data));
    }
    
    return filteredProducts.slice(0, limitCount);
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits pour ${categoryType}:`, error);
    return [];
  }
};

/**
 * Formate les données brutes du produit en un objet Product
 */
const formatProductData = (id: string, data: DocumentData): Product => {
  // Conversion des timestamps Firestore en objets Date
  const createdAt = data.createdAt ? 
    (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : 
    new Date();
  
  const updatedAt = data.updatedAt ? 
    (data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)) : 
    new Date();

  // Extraire les images
  const images: string[] = [];
  
  // Cas 1: Image principale depuis mainImageUrl
  if (data.media?.mainImageUrl && typeof data.media.mainImageUrl === 'string') {
    images.push(data.media.mainImageUrl);
  }
  
  // Cas 2: Image depuis thumbnailUrl (utilisée par certains produits comme ear_cuffs)
  if (data.media?.thumbnailUrl && typeof data.media.thumbnailUrl === 'string' && !images.includes(data.media.thumbnailUrl)) {
    images.push(data.media.thumbnailUrl);
  }
  
  // Cas 3: Images depuis la galerie
  if (data.media?.galleryImageUrls && typeof data.media.galleryImageUrls === 'object') {
    Object.values(data.media.galleryImageUrls).forEach((url) => {
      if (typeof url === 'string' && !images.includes(url)) {
        images.push(url);
      }
    });
  }

  // Prix original et prix actuel (pour les promotions)
  const price = data.pricing?.sale_price || data.pricing?.regular_price || 0;
  const originalPrice = data.pricing?.sale_price ? data.pricing.regular_price : undefined;

  // Calcul de la remise en pourcentage
  let discount: number | undefined = undefined;
  if (originalPrice && price < originalPrice) {
    discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return {
    id,
    name: data.basic_info?.name || 'Produit sans nom',
    description: data.content?.full_description || data.content?.short_description || '',
    price,
    originalPrice,
    images: images.length > 0 ? images : [],
    categories: data.categories || [],
    styles: data.styles || [],
    vibes: data.vibes || [],
    materials: data.materials || [],
    isNew: data.isNew || false,
    discount,
    createdAt,
    updatedAt
  };
};

// Retourne les groupes de filtres pour chaque type de catégorie
export const getCategoryFilters = async (categoryType: 'style' | 'vibe' | 'material') => {
  try {
    // Récupérer les filtres depuis Firestore
    const filtersDoc = await getDoc(doc(db, 'filters', categoryType));
    
    if (filtersDoc.exists()) {
      return filtersDoc.data().groups || getDefaultFilters(categoryType);
    }
    
    return getDefaultFilters(categoryType);
  } catch (error) {
    console.error(`Erreur lors de la récupération des filtres pour ${categoryType}:`, error);
    return getDefaultFilters(categoryType);
  }
};

// Filtres par défaut au cas où la récupération depuis Firestore échoue
const getDefaultFilters = (categoryType: 'style' | 'vibe' | 'material') => {
  switch (categoryType) {
    case 'style':
      return [
        {
          name: 'Matériau',
          options: [
            { id: 'or', label: 'Or' },
            { id: 'argent', label: 'Argent' },
            { id: 'acier', label: 'Acier' },
            { id: 'resine', label: 'Résine' }
          ]
        },
        {
          name: 'Prix',
          options: [
            { id: 'moins-20', label: 'Moins de 20€' },
            { id: '20-50', label: 'Entre 20€ et 50€' },
            { id: 'plus-50', label: 'Plus de 50€' }
          ]
        },
        {
          name: 'Nouveauté',
          options: [
            { id: 'nouveau', label: 'Nouveautés' }
          ]
        }
      ];
      
    case 'vibe':
      return [
        {
          name: 'Style',
          options: [
            { id: 'creoles', label: 'Créoles' },
            { id: 'mini-hoops', label: 'Mini-Hoops' },
            { id: 'ear-cuffs', label: 'Ear Cuffs' },
            { id: 'pendants', label: 'Pendants' }
          ]
        },
        {
          name: 'Matériau',
          options: [
            { id: 'or', label: 'Or' },
            { id: 'argent', label: 'Argent' },
            { id: 'acier', label: 'Acier' },
            { id: 'resine', label: 'Résine' }
          ]
        },
        {
          name: 'Prix',
          options: [
            { id: 'moins-20', label: 'Moins de 20€' },
            { id: '20-50', label: 'Entre 20€ et 50€' },
            { id: 'plus-50', label: 'Plus de 50€' }
          ]
        }
      ];
      
    case 'material':
      return [
        {
          name: 'Style',
          options: [
            { id: 'creoles', label: 'Créoles' },
            { id: 'mini-hoops', label: 'Mini-Hoops' },
            { id: 'ear-cuffs', label: 'Ear Cuffs' },
            { id: 'pendants', label: 'Pendants' }
          ]
        },
        {
          name: 'Vibe',
          options: [
            { id: 'chic', label: 'Chic' },
            { id: 'boheme', label: 'Bohème' },
            { id: 'moderne', label: 'Moderne' },
            { id: 'vintage', label: 'Vintage' }
          ]
        },
        {
          name: 'Prix',
          options: [
            { id: 'moins-20', label: 'Moins de 20€' },
            { id: '20-50', label: 'Entre 20€ et 50€' },
            { id: 'plus-50', label: 'Plus de 50€' }
          ]
        }
      ];
  }
};

/**
 * Récupère toutes les catégories depuis Firestore
 */
export const getAllCategories = async (): Promise<{id: string; data: CategoryData}[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    if (categoriesSnapshot.empty) {
      return [];
    }
    
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data() as CategoryData
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}; 