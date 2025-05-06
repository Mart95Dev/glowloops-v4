"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ProductDisplay } from '@/lib/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiStar } from 'react-icons/hi';

interface ProductListProps {
  products: ProductDisplay[];
}

export default function ProductList({ products }: ProductListProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row"
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="relative w-full sm:w-48 h-48 overflow-hidden">
            <Link href={`/produits/${product.id}`} className="relative block w-full h-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            </Link>
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-menthe text-white text-xs px-2 py-1 rounded-full">
                Nouveau
              </span>
            )}
          </div>
          
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base mb-1 text-gray-800">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(4) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(12)</span>
                  </div>
                </div>
                <span className="font-bold text-lg text-lilas-fonce">{product.price.toFixed(2)} €</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
              <Button 
                className="w-full sm:w-auto rounded-full bg-lilas-fonce hover:bg-lilas-fonce/90 text-white flex items-center justify-center gap-2"
                size="sm"
              >
                <HiOutlineShoppingBag className="h-4 w-4" />
                <span>Ajouter au panier</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Link href={`/produits/${product.id}`}>Voir détails</Link>
                </Button>
                
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label={favorites[product.id] ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  {favorites[product.id] ? (
                    <HiHeart className="h-5 w-5 text-red-500" />
                  ) : (
                    <HiOutlineHeart className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
