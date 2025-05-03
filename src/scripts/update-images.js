/**
 * Script pour mettre à jour les images des produits dans Firebase
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

// Fonction pour vérifier si une URL est valide
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Fonction pour obtenir une URL d'image depuis un dossier de produit existant
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

// Fonction pour mettre à jour l'image d'un produit
const updateProductImage = async (productId, categoryId) => {
  try {
    // Déterminer le dossier source en fonction de la catégorie
    let sourceFolderPath = '';
    switch (categoryId) {
      case 'creoles':
        sourceFolderPath = 'creole_epaisse_vin';
        break;
      case 'puces':
        sourceFolderPath = 'puces_perle_cla';
        break;
      case 'pendantes':
        sourceFolderPath = 'pendante_fine_arg';
        break;
      case 'asymetriques':
        sourceFolderPath = 'asym_lune_etoile';
        break;
      case 'ear_cuffs':
        sourceFolderPath = 'ear_cuff_serpent';
        break;
      default:
        sourceFolderPath = 'creole_torsadee_or';
        break;
    }
    
    // Récupérer une URL d'image depuis le dossier source
    const imageUrl = await getImageFromExistingProduct(sourceFolderPath);
    
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
const updateProductImages = async () => {
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
