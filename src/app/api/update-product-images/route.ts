import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';
import { getProductImages } from '@/lib/services/product-service';

const PRODUCTS_COLLECTION = 'products';

export async function GET() {
  try {
    // Récupérer tous les produits
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const productsSnapshot = await getDocs(productsRef);
    
    console.log(`Traitement de ${productsSnapshot.docs.length} produits...`);
    
    const results: Record<string, { status: string; message: string; imageUrls?: string[] }> = {};
    
    // Pour chaque produit, récupérer les liens d'images
    for (const productDoc of productsSnapshot.docs) {
      const productId = productDoc.id;
      
      try {
        console.log(`Traitement du produit: ${productId}`);
        
        // Récupérer les images sans mettre à jour Firestore
        const images = await getProductImages(productId, false);
        
        // Extraire les URLs des images
        const imageUrls = images.map(img => img.url);
        
        results[productId] = {
          status: 'success',
          message: `${images.length} images trouvées`,
          imageUrls: imageUrls
        };
      } catch (error) {
        console.error(`Erreur lors du traitement des images pour ${productId}:`, error);
        results[productId] = {
          status: 'error',
          message: `Erreur: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Récupération des liens d'images terminée pour ${productsSnapshot.docs.length} produits`,
      results
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des liens d\'images:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de la récupération des liens d\'images',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
