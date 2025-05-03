import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Product, ProductSchema, ProductDisplay } from '../types/product';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

/**
 * Convertit un document Firestore en objet Product
 */
const convertFirestoreDocToProduct = (doc: any): Product => {
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
    collection: product.basic_info?.collection || ''
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
