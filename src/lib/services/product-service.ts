import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
import { db } from '../firebase/firebase-config';
import { Product, ProductSchema, ProductDisplay } from '../types/product';
import { ProductImage } from '../types/product-image';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

/**
 * Convertit un document Firestore en objet Product
 */
export const convertFirestoreDocToProduct = (doc: { id: string; data: () => Record<string, unknown> }): Product => {
  const data = doc.data();
  
  // Conversion des objets en tableaux si nécessaire
  const processedData = { ...data };
  
  // Traitement de basic_info
  if (processedData.basic_info && typeof processedData.basic_info === 'object') {
    const basicInfo = processedData.basic_info as Record<string, unknown>;
    
    // S'assurer que tags est un tableau
    let tagsArray: unknown[] = [];
    if (basicInfo.tags) {
      if (Array.isArray(basicInfo.tags)) {
        tagsArray = basicInfo.tags;
      } else if (typeof basicInfo.tags === 'object') {
        tagsArray = Object.values(basicInfo.tags as Record<string, unknown>);
      }
    }
    
    // Mise à jour de basic_info avec les tags convertis et les valeurs par défaut
    processedData.basic_info = {
      ...basicInfo,
      name: basicInfo.name || `Produit ${doc.id}`,
      sku: basicInfo.sku || `SKU-${doc.id.substring(0, 6)}`,
      slug: basicInfo.slug || `produit-${doc.id.toLowerCase().substring(0, 6)}`,
      categoryId: basicInfo.categoryId || 'autre',
      collection: basicInfo.collection || 'Générale',
      tags: tagsArray
    };
  } else {
    // Si basic_info n'existe pas du tout, le créer avec des valeurs par défaut
    processedData.basic_info = {
      name: `Produit ${doc.id}`,
      sku: `SKU-${doc.id.substring(0, 6)}`,
      slug: `produit-${doc.id.toLowerCase().substring(0, 6)}`,
      categoryId: 'autre',
      collection: 'Générale'
    };
  }
  
  // Traitement des materials
  if (processedData.specifications && typeof processedData.specifications === 'object') {
    const specs = processedData.specifications as Record<string, unknown>;
    
    // S'assurer que materials est un tableau
    let materialsArray: unknown[] = [];
    if (specs.materials) {
      if (Array.isArray(specs.materials)) {
        materialsArray = specs.materials;
      } else if (typeof specs.materials === 'object') {
        materialsArray = Object.values(specs.materials as Record<string, unknown>);
      }
    }
    
    // Mise à jour de specifications avec les materials convertis
    processedData.specifications = {
      ...specs,
      materials: materialsArray
    };
  }
  
  // Traitement des collections
  let collectionsArray: unknown[] = [];
  if (processedData.collections) {
    if (Array.isArray(processedData.collections)) {
      collectionsArray = processedData.collections;
    } else if (typeof processedData.collections === 'object') {
      collectionsArray = Object.values(processedData.collections as Record<string, unknown>);
    }
  }
  processedData.collections = collectionsArray;
  
  // Ajout de valeurs par défaut pour pricing si manquant ou incomplet
  if (!processedData.pricing || typeof processedData.pricing !== 'object') {
    processedData.pricing = {
      regular_price: 0,
      currency: 'EUR'
    };
  } else {
    const pricing = processedData.pricing as Record<string, unknown>;
    processedData.pricing = {
      ...pricing,
      regular_price: pricing.regular_price !== undefined ? pricing.regular_price : 0,
      currency: pricing.currency || 'EUR'
    };
  }
  
  try {
    // Tentative de validation avec le schéma Zod
    return ProductSchema.parse({
      id: doc.id,
      ...processedData
    });
  } catch (error) {
    console.error(`Erreur lors de la validation du produit ${doc.id}:`, error);
    // Retourner une version simplifiée en cas d'erreur de validation
    return {
      id: doc.id,
      basic_info: data.basic_info || {
        name: 'Produit sans nom',
        sku: 'N/A',
        slug: 'produit-sans-nom',
        categoryId: 'autre',
        collection: 'Autre'
      },
      pricing: data.pricing || {
        regular_price: 0,
        currency: 'EUR'
      },
      status: data.status || 'active',
      type: data.type || 'jewelry'
    } as Product;
  }
};

/**
 * Convertit un objet Product en objet ProductDisplay pour l'affichage
 */
export const convertToProductDisplay = (product: Product): ProductDisplay => {
  return {
    id: product.id,
    name: product.basic_info?.name || 'Produit sans nom',
    description: product.content?.short_description || product.content?.full_description || '',
    price: product.pricing?.regular_price || 0,
    imageUrl: product.media?.mainImageUrl || 'https://via.placeholder.com/300x300?text=Image+non+disponible',
    category: product.basic_info?.categoryId || '',
    isNew: product.isNew || false,
    popularity: product.popularity || 0,
    collection: product.basic_info?.collection || '',
    galleryImages: product.media?.galleryImageUrls 
      ? Object.values(product.media.galleryImageUrls) 
      : []
  };
};

/**
 * Récupère un produit par son ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnapshot = await getDoc(productRef);
    
    if (!productSnapshot.exists()) {
      return null;
    }
    
    return convertFirestoreDocToProduct({
      id: productSnapshot.id,
      data: () => productSnapshot.data()
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${productId}:`, error);
    return null;
  }
};

/**
 * Récupère les images d'un produit depuis Firebase Storage et met à jour les liens dans Firestore si nécessaire
 */
export const getProductImages = async (productId: string, updateFirestore = false): Promise<ProductImage[]> => {
  try {
    const storage = getStorage();
    
    // Vérifier d'abord le dossier racine du produit (nouvelle structure)
    const rootImagesRef = ref(storage, `products/${productId}`);
    
    try {
      const rootResult = await listAll(rootImagesRef);
      
      if (rootResult.items.length > 0) {
        const images: ProductImage[] = [];
        let mainImageUrl: string | null = null;
        let thumbnailUrl: string | null = null;
        const galleryImageUrls: Record<string, string> = {};
        
        for (const imageRef of rootResult.items) {
          try {
            const url = await getDownloadURL(imageRef);
            const fileName = imageRef.name.toLowerCase();
            const isMain = fileName.includes('main');
            const isThumbnail = fileName.includes('thumbnail') || fileName.includes('thumb');
            const imageType = isMain ? 'main' : (isThumbnail ? 'thumbnail' : 'gallery');
            
            // Stocker les URLs pour la mise à jour Firestore
            if (isMain) {
              mainImageUrl = url;
            } else if (isThumbnail) {
              thumbnailUrl = url;
            } else {
              // Utiliser l'index comme clé pour les images de galerie
              const galleryIndex = Object.keys(galleryImageUrls).length;
              galleryImageUrls[galleryIndex] = url;
            }
            
            images.push({
              id: imageRef.name,
              url,
              alt: `Image ${imageRef.name} du produit ${productId}`,
              type: imageType
            });
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'URL de l'image ${imageRef.name}:`, error);
          }
        }
        
        // Mettre à jour les liens d'images dans Firestore si demandé
        if (updateFirestore && images.length > 0 && (mainImageUrl || thumbnailUrl || Object.keys(galleryImageUrls).length > 0)) {
          try {
            const productRef = doc(db, PRODUCTS_COLLECTION, productId);
            const productDoc = await getDoc(productRef);
            
            if (productDoc.exists()) {
              const productData = productDoc.data();
              const currentMedia = productData.media || {};
              
              // Préparer la mise à jour
              const mediaUpdate: Record<string, string | Record<string, string>> = {};
              
              if (mainImageUrl) {
                mediaUpdate.mainImageUrl = mainImageUrl;
              }
              
              if (thumbnailUrl) {
                mediaUpdate.thumbnailUrl = thumbnailUrl;
              }
              
              if (Object.keys(galleryImageUrls).length > 0) {
                mediaUpdate.galleryImageUrls = galleryImageUrls;
              }
              
              // Mettre à jour le document
              await updateDoc(productRef, {
                media: {
                  ...currentMedia,
                  ...mediaUpdate
                }
              });
              
              console.log(`Liens d'images mis à jour dans Firestore pour ${productId}`);
            }
          } catch (updateError) {
            console.error(`Erreur lors de la mise à jour des liens d'images dans Firestore pour ${productId}:`, updateError);
          }
        }
        
        console.log(`Nombre d'images trouvées pour ${productId}: ${images.length}`);
        if (images.length > 0) {
          return images;
        }
      }
      
      // Si le dossier racine est vide, essayer le dossier /images (ancienne structure)
      const imagesRef = ref(storage, `products/${productId}/images`);
      const result = await listAll(imagesRef);
      
      if (result.items.length > 0) {
        const images: ProductImage[] = [];
        
        for (const imageRef of result.items) {
          try {
            const url = await getDownloadURL(imageRef);
            images.push({
              id: imageRef.name,
              url,
              alt: `Image ${imageRef.name} du produit ${productId}`,
              type: imageRef.name.includes('main') ? 'main' : 
                    imageRef.name.includes('thumbnail') || imageRef.name.includes('thumb') ? 'thumbnail' : 'gallery'
            });
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'URL de l'image ${imageRef.name}:`, error);
          }
        }
        
        console.log(`Nombre d'images trouvées dans le dossier /images pour ${productId}: ${images.length}`);
        if (images.length > 0) {
          return images;
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des images pour ${productId}:`, error);
    }
    
    // Si aucune image n'est trouvée, retourner un tableau vide
    return [];
  } catch (error) {
    console.error(`Erreur lors de la récupération des images pour ${productId}:`, error);
    return [];
  }
};

/**
 * Récupère un produit avec toutes ses images
 */
export const getProductWithImages = async (productId: string): Promise<{
  product: Product | null;
  images: ProductImage[];
}> => {
  const product = await getProductById(productId);
  const images = product ? await getProductImages(productId) : [];
  
  return {
    product,
    images
  };
};

/**
 * Récupère tous les produits de la base de données
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const productsSnapshot = await getDocs(productsRef);
    
    return productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

/**
 * Récupère les nouveaux produits
 */
export const getNewArrivals = async (limitCount = 6): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('isNew', '==', true),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
  } catch (error) {
    console.error('Erreur lors de la récupération des nouveaux produits:', error);
    return [];
  }
};

/**
 * Récupère les produits les plus populaires
 */
export const getPopularProducts = async (limitCount = 6): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      orderBy('popularity', 'desc'),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
  } catch (error) {
    console.error('Erreur lors de la récupération des produits populaires:', error);
    return [];
  }
};

/**
 * Récupère les produits par catégorie
 */
export const getProductsByCategory = async (categoryId: string, limitCount = 10): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('basic_info.categoryId', '==', categoryId),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la catégorie ${categoryId}:`, error);
    return [];
  }
};

/**
 * Récupère les produits par collection
 */
export const getProductsByCollection = async (collectionName: string, limitCount = 10): Promise<Product[]> => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('collections', 'array-contains', collectionName),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => convertFirestoreDocToProduct(doc));
  } catch (error) {
    console.error(`Erreur lors de la récupération des produits de la collection ${collectionName}:`, error);
    return [];
  }
};
