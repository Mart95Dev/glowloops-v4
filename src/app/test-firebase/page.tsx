"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase-config';

interface Product {
  id: string;
  [key: string]: any;
}

export default function TestFirebase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);
        
        const productsList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Produits récupérés:', productsList);
        setProducts(productsList);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        setError('Erreur lors de la récupération des produits: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Test Firebase</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <h2 className="text-xl font-bold">Erreur</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-xl font-bold">Produits ({products.length})</h2>
          
          {products.length === 0 ? (
            <p className="text-gray-500">Aucun produit trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-lg border p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold">
                    {product.basic_info?.name || 'Produit sans nom'}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {product.id}</p>
                  <pre className="mt-4 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
                    {JSON.stringify(product, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
