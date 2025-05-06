'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductDisplay } from '@/lib/types/product';
import { ProductCard } from '@/components/ProductCard';

interface NewArrivalsSliderProps {
  products: ProductDisplay[];
  title: string;
}

export const NewArrivalsSlider = ({ products, title }: NewArrivalsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Nombre de produits à afficher en fonction de la largeur d'écran
  const [itemsToShow, setItemsToShow] = useState(1);
  
  // Mettre à jour le nombre d'éléments à afficher en fonction de la largeur d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 768) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Calculer le nombre maximum d'index
  const maxIndex = Math.max(0, products.length - itemsToShow);
  
  // Gestion des boutons précédent/suivant
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1));
  };
  
  // Gestion du swipe sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentIndex < maxIndex) {
      goToNext();
    } else if (isRightSwipe && currentIndex > 0) {
      goToPrevious();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-playfair text-2xl font-bold md:text-3xl">{title}</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="rounded-full bg-[var(--lilas-clair)] p-2 text-white transition-opacity disabled:opacity-50"
              aria-label="Produits précédents"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="rounded-full bg-[var(--lilas-clair)] p-2 text-white transition-opacity disabled:opacity-50"
              aria-label="Produits suivants"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={sliderRef}
        >
          <motion.div 
            className="flex"
            initial={{ x: 0 }}
            animate={{ x: `-${currentIndex * 100 / itemsToShow}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="w-full flex-shrink-0 px-2"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
