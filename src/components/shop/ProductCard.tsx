"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { useCartStore } from '@/lib/store/cart-store';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cartStore = useCartStore();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cartStore.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images && product.images.length > 0 ? product.images[0] : '#'
    });
  };

  // Fonction pour obtenir la source d'image la plus sûre
  const getImageSrc = () => {
    // Si aucune image n'est disponible, retourner un gradient CSS
    if (!product.images || product.images.length === 0) {
      return null;
    }
    return product.images[0];
  };

  const imageSrc = getImageSrc();

  if (viewMode === 'list') {
    return (
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full sm:w-40 h-60 sm:h-40 overflow-hidden">
          <Link href={`/produits/${product.id}`}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover transition-transform duration-300 ease-in-out"
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300"
              >
                <span className="text-gray-500 font-medium text-sm">Image non disponible</span>
              </div>
            )}
          </Link>
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-lilas-fonce text-white text-xs font-medium px-2 py-1 rounded-full">
              Nouveau
            </div>
          )}
          {product.discount && (
            <div className="absolute top-2 right-2 bg-dore text-white text-xs font-medium px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="flex-grow p-4">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/produits/${product.id}`} className="hover:underline">
                <h3 className="font-medium mb-1">{product.name}</h3>
              </Link>
              
              <div className="text-sm text-gray-500 mb-2">
                {product.categories && product.categories.join(' • ')}
              </div>
              
              <div className="flex gap-2 mb-4">
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-sm">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
                <span className="font-bold text-lilas-fonce">
                  {product.price.toFixed(2)} €
                </span>
              </div>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-lilas-fonce">
              <Heart size={20} />
            </button>
          </div>
          
          <div className="mt-auto">
            <Button
              onClick={handleAddToCart}
              variant="default"
              className="w-full bg-lilas-fonce text-white hover:bg-lilas-fonce/90"
            >
              Ajouter au panier
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/produits/${product.id}`}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300"
            >
              <span className="text-gray-500 font-medium text-sm">Image non disponible</span>
            </div>
          )}
        </Link>

        {product.isNew && (
          <div className="absolute top-2 left-2 bg-lilas-fonce text-white text-xs font-medium px-2 py-1 rounded-full">
            Nouveau
          </div>
        )}
        
        {product.discount && (
          <div className="absolute top-2 right-2 bg-dore text-white text-xs font-medium px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link href={`/produits/${product.id}`} className="hover:underline">
            <h3 className="font-medium">{product.name}</h3>
          </Link>
          
          <button className="p-1 text-gray-400 hover:text-lilas-fonce">
            <Heart size={18} />
          </button>
        </div>
        
        <div className="text-sm text-gray-500 mb-2 mt-1">
          {product.categories && product.categories.join(' • ')}
        </div>
        
        <div className="flex gap-2 mb-3">
          {product.originalPrice && (
            <span className="text-gray-500 line-through text-sm">
              {product.originalPrice.toFixed(2)} €
            </span>
          )}
          <span className="font-bold text-lilas-fonce">
            {product.price.toFixed(2)} €
          </span>
        </div>
        
        <Button
          onClick={handleAddToCart}
          variant="default"
          className="w-full bg-lilas-fonce text-white hover:bg-lilas-fonce/90"
        >
          Ajouter au panier
        </Button>
      </div>
    </motion.div>
  );
} 