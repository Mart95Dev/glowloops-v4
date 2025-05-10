'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Search } from 'lucide-react';
import { useUserData } from '@/lib/hooks/use-user-data';
import { FavoriteItem } from '@/components/account/favorite-item';

export default function FavorisPage() {
  const { 
    loading, 
    error, 
    favorites, 
    removeFromFavorites, 
    addToCart 
  } = useUserData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFavorites(favorites);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredFavorites(
        favorites.filter(product => 
          product.name.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, favorites]);
  
  if (loading) {
    return <div className="py-6 text-center">Chargement de vos favoris...</div>;
  }
  
  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        Erreur lors du chargement des favoris : {error}
      </div>
    );
  }
  
  return (
    <>
      <h1 className="text-xl md:text-2xl font-playfair text-lilas-fonce mb-6">
        Mes favoris
      </h1>
      
      {/* Barre de recherche et nombre de résultats */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher dans mes favoris..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lilas-clair focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          {filteredFavorites.length} {filteredFavorites.length > 1 ? 'articles' : 'article'}
        </div>
      </div>
      
      {/* Liste des favoris */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-gray-700 font-medium mb-2">
            {searchTerm ? 'Aucun résultat trouvé' : 'Vous n\'avez pas encore de favoris'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchTerm 
              ? 'Essayez avec un autre terme de recherche'
              : 'Ajoutez des produits à vos favoris pour les retrouver ici'
            }
          </p>
          
          {!searchTerm && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-lilas-fonce hover:bg-lilas-clair text-white py-2 px-4 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Découvrir nos produits
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFavorites.map((product) => (
            <FavoriteItem
              key={product.id}
              product={product}
              onRemove={removeFromFavorites}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
      
      {/* CTA pour explorer d'autres produits */}
      {filteredFavorites.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-lilas-fonce hover:bg-lilas-clair text-white py-2 px-4 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Explorer plus de produits
          </Link>
        </div>
      )}
    </>
  );
} 