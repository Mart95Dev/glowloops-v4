import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
import { db } from '../firebase/firebase-config';
import { Product, ProductSchema, ProductDisplay } from '../types/product';
import { ProductImage } from '../types/product-image';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

/**
 * Convertit un document Firestore en objet Product
 */
const convertFirestoreDocToProduct = (doc: { id: string; data: () => Record<string, unknown> }): Product => {
  const data = doc.data();
  try {
    return ProductSchema.parse({
      id: doc.id,
      ...data
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
    name: product.basic_info?.name || '',
    description: product.content?.short_description || product.content?.full_description || '',
    price: product.pricing?.regular_price || 0,
    imageUrl: product.media?.mainImageUrl || '',
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
 * Récupère les images d'un produit depuis Firebase Storage
 */
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    const storage = getStorage();
    const imagesRef = ref(storage, `products/${productId}/images`);
    
    try {
      // Essayer d'abord le dossier /images
      const result = await listAll(imagesRef);
      console.log(`Dossier images trouvé pour ${productId} avec ${result.items.length} éléments`);
      
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
                    imageRef.name.includes('thumbnail') ? 'thumbnail' : 'gallery'
            });
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'URL de l'image ${imageRef.name}:`, error);
          }
        }
        
        console.log(`Nombre d'images trouvées pour ${productId}: ${images.length}`);
        if (images.length > 0) {
          return images;
        }
      }
      
      // Si le dossier /images est vide, essayer le dossier racine du produit
      const rootImagesRef = ref(storage, `products/${productId}`);
      const rootResult = await listAll(rootImagesRef);
      
      if (rootResult.items.length > 0) {
        const images: ProductImage[] = [];
        
        for (const imageRef of rootResult.items) {
          try {
            // Vérifier si c'est un fichier image (extension jpg, png, etc.)
            if (imageRef.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              const url = await getDownloadURL(imageRef);
              images.push({
                id: imageRef.name,
                url,
                alt: `Image ${imageRef.name} du produit ${productId}`,
                type: imageRef.name.includes('main') ? 'main' : 
                      imageRef.name.includes('thumbnail') ? 'thumbnail' : 'gallery'
              });
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'URL de l'image ${imageRef.name}:`, error);
          }
        }
        
        if (images.length > 0) {
          console.log(`Nombre d'images trouvées dans le dossier racine pour ${productId}: ${images.length}`);
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
