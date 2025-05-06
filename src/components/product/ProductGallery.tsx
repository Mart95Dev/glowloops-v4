"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types/product';
import { ProductImage } from '@/lib/types/product-image';
import { HiChevronLeft, HiChevronRight, HiOutlineZoomIn } from 'react-icons/hi';

interface ProductGalleryProps {
  product: Product;
  images: ProductImage[];
}

export default function ProductGallery({ product, images }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Préparer les images pour la galerie
  const galleryImages = [
    // Image principale du produit
    ...(product.media?.mainImageUrl ? [{ 
      id: 'main', 
      url: product.media.mainImageUrl, 
      alt: `Image principale de ${product.basic_info?.name}`,
      type: 'main' as const
    }] : []),
    
    // Images de la galerie du produit
    ...(product.media?.galleryImageUrls 
      ? Object.entries(product.media.galleryImageUrls).map(([key, url]) => ({
          id: `gallery_${key}`,
          url,
          alt: `Image ${parseInt(key) + 1} de ${product.basic_info?.name}`,
          type: 'gallery' as const
        }))
      : []),
    
    // Images supplémentaires de l'API
    ...images.filter(img => img.type === 'gallery' || img.type === 'main')
  ];

  // Éliminer les doublons potentiels
  const uniqueGalleryImages = Array.from(
    new Map(galleryImages.map(img => [img.url, img])).values()
  );

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? uniqueGalleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === uniqueGalleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };

  if (uniqueGalleryImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <div>
      {/* Image principale */}
      <div 
        className="relative aspect-square mb-4 overflow-hidden rounded-lg border border-gray-200"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isZoomed && setIsZoomed(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={uniqueGalleryImages[currentImageIndex]?.url || ''}
              alt={uniqueGalleryImages[currentImageIndex]?.alt || ''}
              fill
              className={`object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-150' : ''
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                    }
                  : {}
              }
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <button
          onClick={handlePrevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-300"
          aria-label="Image précédente"
        >
          <HiChevronLeft className="h-5 w-5 text-lilas-fonce" />
        </button>
        
        <button
          onClick={handleNextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-300"
          aria-label="Image suivante"
        >
          <HiChevronRight className="h-5 w-5 text-lilas-fonce" />
        </button>

        {/* Bouton de zoom */}
        <button
          onClick={handleZoomToggle}
          className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-300"
          aria-label={isZoomed ? "Désactiver le zoom" : "Activer le zoom"}
        >
          <HiOutlineZoomIn className="h-5 w-5 text-lilas-fonce" />
        </button>
      </div>

      {/* Miniatures */}
      <div className="grid grid-cols-5 gap-2">
        {uniqueGalleryImages.slice(0, 5).map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
              currentImageIndex === index
                ? 'border-lilas-fonce'
                : 'border-transparent hover:border-lilas-clair'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 20vw, 10vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
