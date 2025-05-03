/**
 * Script pour mettre à jour les URLs des images des produits dans Firestore
 * Ce script remplace les URLs placeholder par des URLs de Firebase Storage
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const { getStorage, ref, listAll, getDownloadURL } = require('firebase/storage');

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Collection Firestore pour les produits
const PRODUCTS_COLLECTION = 'products';

// Mapping des produits problématiques vers les dossiers de produits existants
const PRODUCT_ID_TO_SOURCE_MAPPING = {
  'mini_hoops_perles': 'puces_perle_cla',
  'huggies_cristal_bleu': 'creole_torsadee_or',
  'creoles_perso_initiales': 'creole_epaisse_vin',
  'asym_lune_etoile': 'pendante_fine_arg'
};

// Mapping des catégories vers les dossiers de produits existants
const CATEGORY_TO_FOLDER_MAPPING = {
  'creoles': 'creole_torsadee_or',
  'puces': 'puces_perle_cla',
  'pendantes': 'pendante_fine_arg',
  'asymetriques': 'pendante_fine_arg',
  'ear_cuffs': 'ear_cuff_serpent',
  'huggies': 'creole_torsadee_or',
  'mini_hoops': 'puces_perle_cla',
  'default': 'creole_torsadee_or'
};

/**
 * Vérifie si une URL est valide
 */
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('https://firebasestorage.googleapis.com');
  } catch {
    return false;
  }
};

/**
 * Récupère une URL d'image depuis un dossier de produit existant
 */
const getImageFromExistingProduct = async (folderPath) => {
  try {
    const imagesRef = ref(storage, `products/${folderPath}`);
    const result = await listAll(imagesRef);
    
    // S'il y a des images, prendre la première
    if (result.items.length > 0) {
      return await getDownloadURL(result.items[0]);
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération d'une image depuis ${folderPath}:`, error);
    return null;
  }
};

/**
 * Met à jour les URLs des images d'un produit
 */
const updateProductImage = async (productId, productData) => {
  try {
    // Déterminer le dossier source pour ce produit
    let sourceFolderPath = '';
    
    // Vérifier si c'est un produit problématique spécifique
    if (PRODUCT_ID_TO_SOURCE_MAPPING[productId]) {
      sourceFolderPath = PRODUCT_ID_TO_SOURCE_MAPPING[productId];
    } else if (productData.basic_info?.categoryId) {
      // Sinon, utiliser la catégorie du produit
      sourceFolderPath = CATEGORY_TO_FOLDER_MAPPING[productData.basic_info.categoryId] || CATEGORY_TO_FOLDER_MAPPING.default;
    } else {
      sourceFolderPath = CATEGORY_TO_FOLDER_MAPPING.default;
    }
    
    // Récupérer une URL d'image depuis le dossier source
    const imageUrl = await getImageFromExistingProduct(sourceFolderPath);
    
    if (!imageUrl) {
      console.error(`❌ Impossible de trouver une image pour le produit ${productId}`);
      return false;
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
    
    console.log(`✅ URLs d'images mises à jour pour le produit ${productId} avec l'URL: ${imageUrl}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour des URLs d'images du produit ${productId}:`, error);
    return false;
  }
};

/**
 * Fonction principale pour vérifier et mettre à jour les URLs des images des produits
 */
const updateProductImageUrls = async () => {
  try {
    console.log('🔍 Vérification des URLs des images des produits...');
    
    // Récupérer tous les produits
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const productsSnapshot = await getDocs(productsRef);
    
    console.log(`📋 Nombre total de produits: ${productsSnapshot.size}`);
    
    let productsWithInvalidUrls = 0;
    let productsUpdated = 0;
    
    // Parcourir tous les produits
    for (const productDoc of productsSnapshot.docs) {
      const productData = productDoc.data();
      const productId = productDoc.id;
      
      // Vérifier si le produit a une URL d'image valide
      const hasValidMainImage = productData.media?.mainImageUrl && 
                               isValidUrl(productData.media.mainImageUrl);
      
      if (!hasValidMainImage) {
        productsWithInvalidUrls++;
        
        // Mettre à jour les URLs des images du produit
        const updated = await updateProductImage(productId, productData);
        if (updated) {
          productsUpdated++;
        }
      }
    }
    
    console.log(`📊 Résumé:`);
    console.log(`   - Produits avec URLs d'images invalides: ${productsWithInvalidUrls}`);
    console.log(`   - Produits mis à jour: ${productsUpdated}`);
    console.log('✨ Terminé!');
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des URLs des images des produits:', error);
  }
};

// Exécuter le script
updateProductImageUrls();
