"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart-store';
import { SHIPPING_OPTIONS } from '@/lib/types/cart';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { getCartRecommendations } from '@/lib/services/cart-service';
import { Product } from '@/lib/types/product';
import { motion } from 'framer-motion';

const CartPage: React.FC = () => {
  const { 
    items, 
    subtotal, 
    total,
    updateItemQuantity, 
    removeItem, 
    clearCart, 
    shipping, 
    setShipping,
    discount,
    syncWithFirestore,
    toCart
  } = useCartStore();

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les recommandations au chargement de la page
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const cart = toCart();
        const recs = await getCartRecommendations(cart);
        setRecommendations(recs);
      } catch (error) {
        console.error('Erreur lors du chargement des recommandations:', error);
      }
    };

    loadRecommendations();
  }, [items, toCart]);

  // Synchroniser avec Firestore lors des changements du panier
  useEffect(() => {
    syncWithFirestore();
  }, [items, shipping, discount, syncWithFirestore]);

  // Gérer la finalisation de la commande
  const handleCheckout = () => {
    setIsLoading(true);
    
    // Rediriger vers la page de paiement
    setTimeout(() => {
      window.location.href = '/paiement';
    }, 500);
  };

  // Si le panier est vide, afficher un message
  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2 className="text-xl font-playfair text-gray-700">Votre panier est vide</h2>
            <p className="text-gray-500">
              Explorez notre sélection de bijoux pour trouver votre bonheur
            </p>
            <Link href="/shop">
              <Button variant="default" className="mt-4">
                Découvrir nos produits
              </Button>
            </Link>
          </div>

          {recommendations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-playfair mb-4">Vous pourriez aimer</h3>
              <div className="grid grid-cols-2 gap-3">
                {recommendations.slice(0, 4).map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/produits/${product.basic_info?.slug || product.id}`}
                    className="block"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={product.media?.mainImageUrl || '/images/placeholder-product.jpg'}
                          alt={product.basic_info?.name || 'Produit'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <h4 className="text-sm font-medium truncate">{product.basic_info?.name}</h4>
                        <p className="text-sm text-lilas-fonce mt-1">
                          {product.pricing?.regular_price?.toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl font-playfair mb-4">Votre Panier</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Liste des produits */}
        <div className="w-full lg:w-2/3 order-2 lg:order-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Articles ({items.length})</CardTitle>
                <button 
                  onClick={() => clearCart()}
                  className="text-sm text-gray-500 hover:text-lilas-fonce transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </CardHeader>
            <CardContent className="divide-y">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Infos produit */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <h3 className="font-medium text-sm sm:text-base pr-2">{item.name}</h3>
                        <p className="font-medium text-sm sm:text-base">{(item.price * item.quantity).toFixed(2)}€</p>
                      </div>
                      
                      {item.color && (
                        <p className="text-xs sm:text-sm text-gray-500">Couleur: {item.color}</p>
                      )}
                      
                      {item.garantie && (
                        <p className="text-xs sm:text-sm text-gray-500">
                          Garantie: {item.garantie.name} (+{item.garantie.price.toFixed(2)}€)
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-700"
                            aria-label="Diminuer la quantité"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-700"
                            aria-label="Augmenter la quantité"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Supprimer"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
          
          {/* Produits recommandés - s'affichent après le récapitulatif sur mobile */}
          <div className="hidden lg:block">
            {recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-playfair mb-4">Vous pourriez aussi aimer</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {recommendations.slice(0, 4).map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/produits/${product.basic_info?.slug || product.id}`}
                      className="block"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={product.media?.mainImageUrl || '/images/placeholder-product.jpg'}
                            alt={product.basic_info?.name || 'Produit'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-medium truncate">{product.basic_info?.name}</h4>
                          <p className="text-sm text-lilas-fonce mt-1">
                            {product.pricing?.regular_price?.toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Résumé et paiement - affiché en premier sur mobile */}
        <div className="w-full lg:w-1/3 order-1 lg:order-2 sticky top-28">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base">Sous-total</span>
                <span className="text-sm sm:text-base">{subtotal.toFixed(2)}€</span>
              </div>
              
              {/* Sélection du mode de livraison */}
              <div>
                <h3 className="font-medium text-sm sm:text-base mb-2">Livraison</h3>
                <div className="space-y-2">
                  {SHIPPING_OPTIONS.map((option) => (
                    <div 
                      key={option.id}
                      className={`p-2 sm:p-3 border rounded-lg cursor-pointer ${
                        shipping?.id === option.id ? 'border-lilas-fonce bg-lilas-clair bg-opacity-10' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setShipping(option)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium text-xs sm:text-sm">{option.name}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                        <div className="font-medium text-xs sm:text-sm">
                          {option.price > 0 ? `${option.price.toFixed(2)}€` : 'Gratuit'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ligne de séparation */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium text-base sm:text-lg">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  TVA incluse
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-3">
                <Button 
                  fullWidth={true}
                  isLoading={isLoading}
                  onClick={handleCheckout}
                  size="lg"
                  className="min-h-[44px] text-sm sm:text-base"
                >
                  Passer au paiement
                </Button>
                <Link href="/shop" className="block text-center">
                  <Button 
                    variant="ghost" 
                    fullWidth={true}
                    className="text-sm sm:text-base"
                  >
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          {/* Note sur la sécurité et livraison */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-center text-xs sm:text-sm mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-lilas-fonce"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Paiement 100% sécurisé
            </div>
            <div className="flex items-center text-xs sm:text-sm mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-lilas-fonce"
              >
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              Livraison dans toute la France
            </div>
            <div className="flex items-center text-xs sm:text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-lilas-fonce"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Retours gratuits sous 30 jours
            </div>
          </div>
        </div>
      </div>
      
      {/* Produits recommandés - version mobile (sous le panier) */}
      <div className="lg:hidden mt-6">
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-xl font-playfair mb-4">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.slice(0, 4).map((product) => (
                <Link 
                  key={product.id} 
                  href={`/produits/${product.basic_info?.slug || product.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.media?.mainImageUrl || '/images/placeholder-product.jpg'}
                        alt={product.basic_info?.name || 'Produit'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-sm font-medium truncate">{product.basic_info?.name}</h4>
                      <p className="text-sm text-lilas-fonce mt-1">
                        {product.pricing?.regular_price?.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 