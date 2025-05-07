"use client";

import { useCartStore } from '@/lib/store/cart-store';
import { toast } from '@/lib/utils/toast';
import { useState, useEffect } from 'react';

export const CartTester: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const { items, addItem, clearCart, totalItems: storeTotalItems, recalculateTotals } = useCartStore();
  
  useEffect(() => {
    setIsClient(true);
    console.log("[CartTester] Composant monté");
  }, []);
  
  // Calculer le nombre total d'articles manuellement
  const calculatedTotalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Forcer le recalcul des totaux
  useEffect(() => {
    if (isClient) {
      // Récupérer les totaux recalculés avec le type correct
      const totals = recalculateTotals() as { totalItems: number; totalPrice: number };
      console.log(`[CartTester] Recalcul forcé: totalItems = ${totals.totalItems}`);
    }
  }, [isClient, items.length, recalculateTotals]);
  
  const handleAddTestProduct = () => {
    console.log("[CartTester] Ajout d'un produit au panier");
    
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
    console.log("[CartTester] Vider le panier");
    clearCart();
    toast.success("Panier vidé");
  };
  
  if (!isClient) return null;
  
  // Vérifier s'il y a une différence entre la valeur calculée et celle du store
  const hasMismatch = calculatedTotalItems !== storeTotalItems;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-menthe flex flex-col gap-2">
      <h3 className="text-sm font-bold">Test Panier</h3>
      <div className="text-xs mb-2">
        <div>Produits: <span className="font-bold">{items.length}</span></div>
        <div>
          Total calculé: <span className="font-bold">{calculatedTotalItems}</span>
        </div>
        <div>
          Total du store: <span className={`font-bold ${hasMismatch ? 'text-red-500' : ''}`}>{storeTotalItems}</span>
          {hasMismatch && <span className="ml-1 text-red-500">⚠️</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleAddTestProduct}
          className="bg-menthe text-white px-2 py-1 rounded text-xs"
        >
          + Ajouter produit
        </button>
        
        <button 
          onClick={handleClearCart}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Vider
        </button>
      </div>
      
      {hasMismatch && (
        <button 
          onClick={() => {
            recalculateTotals();
            toast.info("Recalcul forcé du panier");
          }}
          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mt-1"
        >
          Forcer recalcul
        </button>
      )}
    </div>
  );
}; 