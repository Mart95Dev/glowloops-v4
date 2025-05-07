"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ProductDisplay } from '@/lib/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from '@/lib/utils/toast';

interface ModernBestSellersSectionProps {
  products: ProductDisplay[];
  title: string;
  subtitle: string;
}

export default function ModernBestSellersSection({ 
  products, 
  title, 
  subtitle 
}: ModernBestSellersSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isFavorite, setIsFavorite] = useState<Record<string, boolean>>({});
  const { addItem } = useCartStore();

  const toggleFavorite = (productId: string) => {
    setIsFavorite(prev => ({
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

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (product: ProductDisplay, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('BestSellers: Ajout au panier', product);
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl,
    });
    
    // Afficher une notification pour confirmer l'ajout au panier
    toast.success("Produit ajouté au panier", {
      description: product.name
    });
  };

  return (
    <section ref={ref} className="py-16 px-4 bg-creme-nude min-w-[375px]">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-3">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              variants={itemVariants}
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
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-300"
                >
                  {isFavorite[product.id] ? (
                    <HiHeart className="h-5 w-5 text-red-500" />
                  ) : (
                    <HiOutlineHeart className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                {product.popularity > 8 && (
                  <span className="absolute top-3 left-3 bg-dore text-white text-xs px-2 py-1 rounded-full">
                    Best-seller
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
                    <span className="font-bold text-lilas-fonce">{product.price.toFixed(2)} €</span>
                    {false && (
                      <span className="text-sm line-through text-gray-400">
                        {(product.price * 1.2).toFixed(2)} €
                      </span>
                    )}
                  </div>
                  <Button 
                    className="w-full rounded-full bg-lilas-fonce hover:bg-lilas-fonce/90 text-white flex items-center justify-center gap-2"
                    size="sm"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <HiOutlineShoppingBag className="h-4 w-4" />
                    <span>Ajouter au panier</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10">
          <Link href="/best-sellers">
            <Button 
              variant="outline" 
              className="rounded-full border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10"
            >
              Voir tous les best-sellers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
