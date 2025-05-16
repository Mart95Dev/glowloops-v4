"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CategoryHeaderProps {
  title: string;
  description: string;
  imageUrl: string;
  categoryType: 'style' | 'vibe' | 'material';
}

export default function CategoryHeader({ 
  title, 
  description, 
  imageUrl,
  categoryType
}: CategoryHeaderProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getBgGradient = () => {
    switch (categoryType) {
      case 'style':
        return 'from-lilas-fonce/70 to-transparent';
      case 'vibe':
        return 'from-dore/70 to-transparent';
      case 'material':
        return 'from-menthe/70 to-transparent';
      default:
        return 'from-lilas-fonce/70 to-transparent';
    }
  };

  // Image par défaut si l'URL est invalide ou pointe vers le dossier local
  const getImageUrl = () => {
    if (!imageUrl || imageUrl.startsWith('/images/categories/')) {
      return `/images/placeholder-category-header.jpg`;
    }
    return imageUrl;
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-40 sm:h-60 md:h-80 mb-6 overflow-hidden rounded-lg"
    >
      <Image 
        src={getImageUrl()} 
        alt={title} 
        fill 
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
        priority
        className="object-cover" 
      />
      
      {/* Overlay sombre pour améliorer le contraste et la lisibilité */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Gradient coloré spécifique à la catégorie */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getBgGradient()} flex items-center`}>
        <div className="p-4 sm:p-6 md:p-8 max-w-md relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3 drop-shadow-lg"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white text-sm sm:text-base drop-shadow-lg"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
} 