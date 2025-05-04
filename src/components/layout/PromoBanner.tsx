import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface PromoBannerProps {
  message: string;
  endDate: Date;
  variant?: 'default' | 'success' | 'warning';
  link?: string;
}

export default function PromoBanner({ 
  message, 
  endDate, 
  variant = 'default', 
  link 
}: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Calculer le temps restant
  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Si la promo est terminée, masquer la bannière
        setIsVisible(false);
      }
    };

    // Calculer immédiatement puis toutes les secondes
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endDate]);

  // Définir les couleurs en fonction de la variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-menthe text-white';
      case 'warning':
        return 'bg-dore text-white';
      default:
        return 'bg-lilas-clair';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Si pas encore monté côté client ou si la bannière est masquée, ne rien afficher
  if (!isMounted || !isVisible) {
    return null;
  }

  const bannerContent = (
    <>
      <span className="font-medium">{message}</span>
      <span className="hidden sm:inline mx-2">|</span>
      <span className="font-mono">
        {timeLeft.days > 0 && <span>{timeLeft.days}j </span>}
        <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
      </span>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`py-3 px-4 text-center text-sm font-medium relative ${getVariantClasses()}`}
    >
      <div className="container mx-auto flex justify-center items-center max-w-7xl">
        {link ? (
          <Link href={link} className="hover:underline flex-1 text-center">
            {bannerContent}
          </Link>
        ) : (
          <div className="flex-1 text-center">
            {bannerContent}
          </div>
        )}
        
        <button 
          onClick={handleClose}
          className="absolute right-4 text-current opacity-70 hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
}
