import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';

export async function GET() {
  try {
    // Récupérer tous les produits de Firestore
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    
    // Transformer les documents en objets JavaScript
    const products = productsSnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    
    // Retourner les données au format JSON
    return NextResponse.json({ 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Erreur lors de l\'inspection des produits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}
