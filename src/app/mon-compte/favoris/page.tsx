'use client';

import { useState } from 'react';
import { useUserData } from '@/lib/hooks/use-user-data';
import { FavoriteItem } from '@/components/account/favorite-item';
import { Heart, Search } from 'lucide-react';

export default function FavoritesPage() {
  const { loading, error, favorites, removeFromFavorites, addToCart } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700">
        <h2 className="text-lg font-medium mb-2">Erreur</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Filtrer les favoris
  const filteredFavorites = favorites.filter((favorite) => {
    return searchQuery 
      ? favorite.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  });
  
  return (
    <>
      <h1 className="text-xl md:text-2xl font-playfair text-lilas-fonce mb-6">
        Mes favoris
      </h1>
      
      {/* Barre de recherche */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher dans mes favoris..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lilas-clair focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Liste des favoris */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFavorites.map((product) => (
            <FavoriteItem 
              key={product.id} 
              product={product}
              onRemove={removeFromFavorites}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
          <div className="text-gray-300 mb-4">
            <Heart className="w-12 h-12 mx-auto" />
          </div>
          {searchQuery ? (
            <>
              <h3 className="text-gray-700 font-medium mb-1">Aucun favori trouvé</h3>
              <p className="text-gray-500 text-sm mb-4">
                Essayez de modifier votre recherche
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
              >
                Afficher tous les favoris
              </button>
            </>
          ) : (
            <>
              <h3 className="text-gray-700 font-medium mb-1">Pas encore de favoris</h3>
              <p className="text-gray-500 text-sm mb-4">
                Ajoutez des produits à vos favoris pour les retrouver facilement
              </p>
              <a
                href="/shop"
                className="bg-lilas-fonce text-white px-4 py-2 rounded-lg hover:bg-lilas-clair transition-colors"
              >
                Découvrir nos produits
              </a>
            </>
          )}
        </div>
      )}
    </>
  );
} 