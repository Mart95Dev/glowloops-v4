"use client";

import { useCartStore } from '@/lib/store/cart-store';
import { toast } from '@/lib/utils/toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CartButtonClassic } from '@/components/ui/navbar';

export default function TestPanierPage() {
  const [isClient, setIsClient] = useState(false);
  const { items, addItem, clearCart, recalculateTotals, totalItems } = useCartStore();
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
    console.log("Page de test du panier chargée");
  }, []);
  
  // Force le recalcul des totaux
  useEffect(() => {
    if (isClient) {
      // Récupérer les totaux recalculés avec le type correct
      const result = recalculateTotals() as { totalItems: number; totalPrice: number };
      console.log(`[Test Panier] Recalcul forcé: totalItems = ${result.totalItems}`);
    }
  }, [isClient, recalculateTotals]);
  
  // Calculer le nombre total d'articles
  const itemsCount = isClient 
    ? items.reduce((total, item) => total + item.quantity, 0) 
    : 0;
  
  const handleAddTestProduct = () => {
    console.log("Test: ajout d'un produit au panier");
    
    addItem({
      productId: 'test-' + Date.now(),
      name: 'Produit Test',
      price: 19.99,
      quantity: 1,
      image: '/images/placeholder.jpg',
    });
    
    toast.success("Produit test ajouté au panier");
  };
  
  const handleClearCart = () => {
    console.log("Test: vider le panier");
    clearCart();
    toast.success("Panier vidé");
  };
  
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold text-lilas-fonce mb-8">Page de test du panier</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Infos de débogage */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Informations de débogage</h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium">Nombre de produits dans le panier:</p>
              <p className="text-xl font-bold">{items.length}</p>
            </div>
            
            <div>
              <p className="font-medium">Quantité totale d&apos;articles (calculée manuellement):</p>
              <p className="text-xl font-bold">{itemsCount}</p>
            </div>
            
            <div>
              <p className="font-medium">Quantité totale d&apos;articles (from store):</p>
              <p className="text-xl font-bold">{totalItems}</p>
            </div>
            
            <div>
              <p className="font-medium">Actions:</p>
              <div className="flex gap-4 mt-2">
                <Button 
                  onClick={handleAddTestProduct}
                  className="bg-menthe text-white px-4 py-2 rounded"
                >
                  Ajouter un produit
                </Button>
                
                <Button 
                  onClick={handleClearCart}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Vider le panier
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des produits */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Produits dans le panier</h2>
          
          {items.length === 0 ? (
            <p className="text-gray-500">Le panier est vide</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border-b pb-2">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex justify-between text-sm">
                    <p>Prix: {item.price.toFixed(2)} €</p>
                    <p>Quantité: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Test du composant CartButtonClassic */}
          <div className="mt-8 p-4 border border-dashed border-lilas-clair rounded-lg">
            <h3 className="text-md font-medium mb-2">Test du composant CartButton</h3>
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <CartButtonClassic />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          onClick={() => router.push('/')}
          className="border border-lilas-fonce text-lilas-fonce hover:bg-lilas-fonce/10"
        >
          Retour à l&apos;accueil
        </Button>
      </div>
    </div>
  );
} 