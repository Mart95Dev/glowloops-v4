/**
 * Script pour vérifier et mettre à jour les images des produits dans Firebase
 * 
 * Ce script va parcourir tous les produits dans la collection Firebase et vérifier
 * si chaque produit a une URL d'image valide. Si ce n'est pas le cas, il va mettre
 * à jour le produit avec une URL d'image depuis le dossier correspondant dans Firebase Storage.
 */

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/firebase-config';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

// Fonction pour vérifier si une URL est valide
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Fonction pour obtenir une URL d'image depuis Firebase Storage en fonction du type de produit
const getImageUrlFromStorage = async (productType: string): Promise<string | null> => {
  try {
    const storage = getStorage();
    let folderPath = '';
    
    // Déterminer le chemin du dossier en fonction du type de produit
    switch (productType) {
      case 'creoles':
        folderPath = 'creole_epaisse_vin';
        break;
      case 'puces':
        folderPath = 'puces_perle_cla';
        break;
      case 'pendantes':
        folderPath = 'pendante_fine_arg';
        break;
      case 'asymetriques':
        folderPath = 'asym_lune_etoile';
        break;
      case 'ear_cuffs':
        folderPath = 'ear_cuff_serpent';
        break;
      default:
        // Utiliser un produit existant comme fallback
        folderPath = 'creole_torsadee_or';
        break;
    }
    
    // Récupérer les images du dossier
    const imagesRef = ref(storage, `products/${folderPath}`);
    const result = await listAll(imagesRef);
    
    // S'il y a des images, prendre la première
    if (result.items.length > 0) {
      return await getDownloadURL(result.items[0]);
    }
    
    // Si aucune image n'est trouvée, utiliser une image par défaut depuis les images publiques
    const defaultImageIndex = Math.floor(Math.random() * 30) + 1; // Choisir une image aléatoire entre 1 et 30
    return `/public/${defaultImageIndex}.avif`;
  } catch (error) {
    console.error(`Erreur lors de la récupération d'une image pour le type ${productType}:`, error);
    return null;
  }
};

// Fonction pour mettre à jour l'image d'un produit
const updateProductImage = async (productId: string, categoryId: string): Promise<void> => {
  try {
    // Récupérer une URL d'image depuis Firebase Storage
    const imageUrl = await getImageUrlFromStorage(categoryId);
    
    if (!imageUrl) {
      console.error(`❌ Impossible de trouver une image pour le produit ${productId} (catégorie: ${categoryId})`);
      return;
    }
    
    // Mettre à jour le document du produit avec l'URL d'image
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      media: {
        mainImageUrl: imageUrl,
        thumbnailUrl: imageUrl,
        galleryImageUrls: {
          0: imageUrl
        }
      }
    });
    
    console.log(`✅ Image mise à jour pour le produit ${productId} (catégorie: ${categoryId}) avec l'URL: ${imageUrl}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de l'image du produit ${productId}:`, error);
  }
};

// Fonction principale pour vérifier et mettre à jour les images des produits
const updateProductImages = async (): Promise<void> => {
  try {
    console.log('🔍 Vérification des images des produits...');
    
    // Récupérer tous les produits
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const productsSnapshot = await getDocs(productsRef);
    
    console.log(`📋 Nombre total de produits: ${productsSnapshot.size}`);
    
    let productsWithoutImages = 0;
    let productsUpdated = 0;
    
    // Parcourir tous les produits
    for (const productDoc of productsSnapshot.docs) {
      const productData = productDoc.data();
      const productId = productDoc.id;
      
      // Vérifier si le produit a une URL d'image valide
      const hasValidMainImage = productData.media?.mainImageUrl && isValidUrl(productData.media.mainImageUrl);
      
      if (!hasValidMainImage) {
        productsWithoutImages++;
        
        // Récupérer la catégorie du produit
        const categoryId = productData.basic_info?.categoryId || 'default';
        
        // Mettre à jour l'image du produit
        await updateProductImage(productId, categoryId);
        productsUpdated++;
      }
    }
    
    console.log(`📊 Résumé:`);
    console.log(`   - Produits sans images valides: ${productsWithoutImages}`);
    console.log(`   - Produits mis à jour: ${productsUpdated}`);
    console.log('✨ Terminé!');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des images des produits:', error);
  }
};

// Exécuter le script
updateProductImages();
