"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getProductsByCategory } from '@/lib/services/product-service';
import { ProductDisplay } from '@/lib/types/product';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HiOutlineShoppingBag } from 'react-icons/hi';

interface CompleteSetSectionProps {
  productId: string;
}

export default function CompleteSetSection({ productId }: CompleteSetSectionProps) {
  const [bundleProducts, setBundleProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Remise appliquée pour l'ensemble complet
  const discountPercentage = 30;

  useEffect(() => {
    const loadBundleProducts = async () => {
      setIsLoading(true);
      try {
        // Dans un cas réel, on utiliserait une fonction pour récupérer les produits d'un ensemble
        // Ici, on utilise getProductsByCategory comme substitut
        const products = await getProductsByCategory('boucles', 5);
        
        // Filtrer le produit actuel et limiter à 3 produits pour l'ensemble
        const filtered = products
          .filter(product => product.id !== productId)
          .slice(0, 3);
        
        setBundleProducts(filtered.map(product => ({
          id: product.id,
          name: product.basic_info?.name || '',
          description: product.content?.short_description || '',
          price: product.pricing?.regular_price || 0,
          imageUrl: product.media?.mainImageUrl || '',
          category: product.basic_info?.categoryId || '',
          isNew: product.isNew || false,
          popularity: product.popularity || 0,
          collection: product.basic_info?.collection || '',
          galleryImages: product.media?.galleryImageUrls 
            ? Object.values(product.media.galleryImageUrls) 
            : []
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des produits de l\'ensemble:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBundleProducts();
  }, [productId]);

  // Calculer le prix total et le prix avec remise
  const calculateTotals = () => {
    const totalPrice = bundleProducts.reduce((sum, product) => sum + product.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);
    
    return {
      originalPrice: totalPrice,
      discountedPrice,
      savings: totalPrice - discountedPrice
    };
  };

  const { originalPrice, discountedPrice, savings } = calculateTotals();

  // Formater le prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
      </div>
    );
  }

  if (bundleProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
        Ensemble complet recommandé
        <Badge variant="outline" className="ml-2 bg-dore text-white border-dore">
          -30%
        </Badge>
      </h2>
      
      <div className="bg-lilas-clair/10 rounded-lg overflow-hidden mb-6">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Images des produits */}
            <div className="flex items-center justify-center gap-2 md:w-1/2">
              <div className="flex flex-wrap justify-center gap-4">
                {bundleProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 96px"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Informations de l'ensemble */}
            <div className="md:w-1/2">
              <h3 className="font-medium text-lg text-gray-800 mb-2">
                Collection Harmonie
              </h3>
              
              <p className="text-gray-600 mb-4">
                Cet ensemble complet vous permet de créer un look harmonieux et élégant. 
                Les pièces sont conçues pour être portées ensemble ou séparément selon vos envies.
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="font-bold text-lilas-fonce text-lg">
                  {formatPrice(discountedPrice)}
                </span>
                <Badge variant="outline" className="bg-dore text-white border-dore">
                  <span>Économisez {formatPrice(savings)}</span>
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {bundleProducts.map((product) => (
                  <div key={product.id} className="text-sm text-gray-600 flex items-center gap-1">
                    <svg className="h-4 w-4 text-lilas-fonce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="bg-lilas-fonce hover:bg-lilas-fonce/90 text-white rounded-full flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <HiOutlineShoppingBag className="h-4 w-4" />
                <span>Ajouter l&apos;ensemble au panier</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
