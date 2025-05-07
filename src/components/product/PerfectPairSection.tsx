"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProductsByCategory } from '@/lib/services/product-service';
import { ProductDisplay } from '@/lib/types/product';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { HiOutlineShoppingBag } from 'react-icons/hi';

interface PerfectPairSectionProps {
  productId: string;
}

export default function PerfectPairSection({ productId }: PerfectPairSectionProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

  // Remise appliquée pour l'ensemble
  const discountPercentage = 20;

  useEffect(() => {
    const loadRelatedProducts = async () => {
      setIsLoading(true);
      try {
        // Dans un cas réel, on utiliserait une fonction pour récupérer les produits complémentaires
        // Ici, on utilise getProductsByCategory comme substitut
        const products = await getProductsByCategory('boucles', 4);
        
        // Filtrer le produit actuel
        const filtered = products
          .filter(product => product.id !== productId)
          .slice(0, 3); // Limiter à 3 produits
        
        setRelatedProducts(filtered.map(product => ({
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
        console.error('Erreur lors du chargement des produits complémentaires:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedProducts();
  }, [productId]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Calculer le prix total et le prix avec remise
  const calculateTotals = () => {
    const selectedProductsList = relatedProducts.filter(product => selectedProducts[product.id]);
    
    const totalPrice = selectedProductsList.reduce((sum, product) => sum + product.price, 0);
    const discountedPrice = totalPrice * (1 - discountPercentage / 100);
    
    return {
      originalPrice: totalPrice,
      discountedPrice,
      savings: totalPrice - discountedPrice,
      count: selectedProductsList.length
    };
  };

  const { originalPrice, discountedPrice, savings, count } = calculateTotals();

  // Formater le prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
        Parfait ensemble
        <Badge variant="outline" className="ml-2 bg-dore text-white border-dore">
          -20%
        </Badge>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {relatedProducts.map((product) => (
          <motion.div
            key={product.id}
            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border-2 ${
              selectedProducts[product.id] ? 'border-lilas-fonce' : 'border-transparent'
            }`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="relative aspect-square overflow-hidden group">
              <Link href={`/produits/${product.id}`} className="relative block w-full h-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </Link>
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  variant="outline" 
                  className="bg-white text-lilas-fonce hover:bg-lilas-clair/10"
                  onClick={() => window.open(`/produits/${product.id}`, '_blank')}
                >
                  Voir le produit
                </Button>
              </div>
              
              {product.isNew && (
                <span className="absolute top-3 left-3 bg-menthe text-white text-xs px-2 py-1 rounded-full">
                  Nouveau
                </span>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-medium text-sm mb-1 text-gray-800">{product.name}</h3>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(4) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">(12)</span>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lilas-fonce">{formatPrice(product.price)}</span>
                </div>
                
                <Button 
                  onClick={() => toggleProductSelection(product.id)}
                  className={`w-full rounded-full ${
                    selectedProducts[product.id]
                      ? 'bg-lilas-fonce hover:bg-lilas-fonce/90 text-white'
                      : 'bg-white border-2 border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10'
                  } flex items-center justify-center gap-2`}
                  size="sm"
                >
                  {selectedProducts[product.id] ? 'Sélectionné' : 'Ajouter à l\'ensemble'}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Résumé de l'ensemble */}
      {count > 0 && (
        <div className="bg-lilas-clair/10 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium text-gray-800">
                {count} {count > 1 ? 'produits' : 'produit'} sélectionné{count > 1 ? 's' : ''}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="font-bold text-lilas-fonce">
                  {formatPrice(discountedPrice)}
                </span>
                <Badge variant="outline" className="bg-dore text-white border-dore text-xs">
                  Économisez {formatPrice(savings)}
                </Badge>
              </div>
            </div>
            
            <Button 
              className="bg-lilas-fonce hover:bg-lilas-fonce/90 text-white rounded-full flex items-center justify-center gap-2"
            >
              <HiOutlineShoppingBag className="h-4 w-4" />
              <span>Ajouter l&apos;ensemble au panier</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
