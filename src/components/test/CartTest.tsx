"use client";

import { useCartStore } from '@/lib/store/cart-store';
import { toast } from '@/lib/utils/toast';
import { Button } from '@/components/ui/Button';

export default function CartTest() {
  const { items, addItem, updateItemQuantity, removeItem, clearCart, totalItems } = useCartStore();
  const testProduct = {
    productId: 'test-product-1',
    name: 'Produit de Test',
    price: 19.99,
    quantity: 1,
    image: '/images/placeholder.jpg',
  };

  const handleAddToCart = () => {
    addItem(testProduct);
    toast.success('Produit ajouté au panier', {
      description: testProduct.name
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.info('Panier vidé', {
      description: 'Tous les articles ont été supprimés'
    });
  };

  const handleIncreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1);
    } else if (item) {
      removeItem(id);
      toast.info('Produit retiré du panier');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-lilas-fonce mb-4">Test du Panier</h1>
      
      <div className="mb-6 p-4 border border-lilas-clair rounded-lg">
        <h2 className="text-lg font-semibold mb-2">État actuel du panier</h2>
        <p className="text-sm mb-1">Nombre d&apos;articles : <span className="font-bold">{totalItems}</span></p>
        <p className="text-sm mb-4">Articles différents : <span className="font-bold">{items.length}</span></p>
        
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.price.toFixed(2)} € × {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    className="px-2 py-1 min-h-[30px] min-w-[30px]"
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleIncreaseQuantity(item.id)}
                    className="px-2 py-1 min-h-[30px] min-w-[30px]"
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Le panier est vide</p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <Button 
          onClick={handleAddToCart}
          className="bg-lilas-fonce hover:bg-lilas-fonce/90 text-white"
        >
          Ajouter un article
        </Button>
        
        <Button 
          onClick={handleClearCart}
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          disabled={items.length === 0}
        >
          Vider le panier
        </Button>
      </div>
    </div>
  );
} 