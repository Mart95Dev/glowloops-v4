'use client';

import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Settings, Loader2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavoritesStore, useWishlistPublic, FavoriteItem } from '@/lib/store/favoritesStore';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuth } from '@/lib/firebase/auth';
import { toast } from '@/lib/utils/toast';
import { WishlistSettings } from '@/components/account/wishlist-settings';
import Image from 'next/image';
import Link from 'next/link';

export default function FavorisPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();
  const { items, removeItem, syncWithFirebase } = useFavoritesStore();
  const { wishlistSettings, getPublicWishlistUrl } = useWishlistPublic();
  const { addItem } = useCartStore();
  const publicUrl = getPublicWishlistUrl();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (user) {
        try {
          await syncWithFirebase();
          // Ajouter un événement pour indiquer que les favoris ont été chargés
          window.dispatchEvent(new Event('favoritesUpdated'));
        } catch (error) {
          console.error('Erreur lors de la synchronisation des favoris:', error);
          toast.error('Erreur lors du chargement des favoris');
        }
      }
      setIsLoading(false);
    };

    fetchData();
    
    // Recharger les données lorsque l'utilisateur change
  }, [user, syncWithFirebase]);

  // Écouter les événements de mise à jour des favoris
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      // Pas besoin de refaire un chargement complet, juste mettre à jour l'UI
      if (user) {
        syncWithFirebase();
      }
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [user, syncWithFirebase]);

  const handleRemoveFromFavorites = async (id: string) => {
    try {
      await removeItem(id);
      // Émettre un événement pour notifier la mise à jour des favoris
      window.dispatchEvent(new Event('favoritesUpdated'));
      toast.success('Produit retiré des favoris');
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      toast.error('Erreur lors de la suppression du favori');
    }
  };

  const handleAddToCart = (product: FavoriteItem) => {
    addItem({
      productId: product.id,
      name: product.nom,
      price: product.prix,
      quantity: 1,
      image: product.image
    });
    toast.success('Produit ajouté au panier');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-lilas-fonce animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Mes favoris</h1>
          <p className="text-gray-600">
            {items.length === 0
              ? 'Vous n\'avez pas encore de produits favoris'
              : `${items.length} produit${items.length > 1 ? 's' : ''} en favoris`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {wishlistSettings?.isPublic && publicUrl && (
            <Link
              href={publicUrl}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-lilas-fonce text-lilas-fonce rounded-full hover:bg-lilas-fonce/10 transition-colors"
            >
              <Share2 size={16} />
              <span>Voir ma wishlist publique</span>
            </Link>
          )}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-lilas-fonce text-white rounded-full hover:bg-lilas-clair transition-colors"
          >
            <Settings size={16} />
            <span>Paramètres de wishlist</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <WishlistSettings />
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
          <p className="text-gray-600 mb-6">Vous n&apos;avez pas encore ajouté de produits à vos favoris.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lilas-fonce text-white rounded-full hover:bg-lilas-clair transition-colors"
          >
            <ShoppingBag size={18} />
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-56">
                <Image
                  src={item.image || '/images/placeholder.jpg'}
                  alt={item.nom}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemoveFromFavorites(item.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:bg-red-50 transition-colors"
                  aria-label="Retirer des favoris"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{item.nom}</h3>
                <p className="text-lilas-fonce font-bold mb-4">
                  {item.prix.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/produits/${item.id}`}
                    className="text-sm text-gray-700 hover:text-lilas-fonce transition-colors"
                  >
                    Voir le produit
                  </Link>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-lilas-fonce text-white rounded-full hover:bg-lilas-clair transition-colors text-sm"
                  >
                    <ShoppingBag size={14} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 