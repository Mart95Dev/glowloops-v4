"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductDisplay } from '@/lib/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HiChevronLeft, HiChevronRight, HiOutlineShoppingBag } from 'react-icons/hi';
import { useInView } from 'react-intersection-observer';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from '@/lib/utils/toast';
import { FavoriteToggle } from '@/components/account/favorite-toggle';

interface ModernNewArrivalsSliderProps {
  products: ProductDisplay[];
  title: string;
}

export default function ModernNewArrivalsSlider({ products, title }: ModernNewArrivalsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { addItem } = useCartStore();

  const nextSlide = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(products.length - 1);
    }
  };

  // Calculer le nombre d'éléments à afficher en fonction de la largeur d'écran
  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 1;
      if (width < 768) return 2;
      if (width < 1024) return 3;
      return 4;
    }
    return 4; // Par défaut pour SSR
  };

  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };

    handleResize(); // Initialiser
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    console.log('NewArrivals: Ajout au panier', product);
    
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
    <section ref={ref} className="min-w-[375px] py-16 px-4 bg-gradient-to-b from-creme-nude to-white">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce relative"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {title}
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-menthe rounded-full"></span>
          </motion.h2>
          <div className="flex gap-2">
            <Button 
              onClick={prevSlide} 
              variant="outline" 
              size="icon" 
              className="rounded-full border-lilas-clair hover:bg-lilas-clair/10"
            >
              <HiChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              onClick={nextSlide} 
              variant="outline" 
              size="icon" 
              className="rounded-full border-lilas-clair hover:bg-lilas-clair/10"
            >
              <HiChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden" ref={sliderRef}>
          <motion.div
            className="flex gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              transition: 'transform 0.5s ease-in-out',
              width: `${(100 * products.length) / visibleItems}%`,
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden group">
                    <Link href={`/produits/${product.id}`}>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </Link>
                    <FavoriteToggle
                      productId={product.id}
                      productName={product.name}
                      productPrice={product.price}
                      productImage={product.imageUrl}
                      size="md"
                      className="absolute top-3 right-3"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-menthe text-white text-xs px-2 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-sm mb-1 text-gray-800">{product.name}</h3>
                    <span className="text-xs text-gray-500">{product.category}</span>
                    <div className="mt-auto flex justify-between items-center mb-3">
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
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/nouveautes">
            <Button 
              variant="outline" 
              className="rounded-full border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10"
            >
              Voir toutes les nouveautés
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
