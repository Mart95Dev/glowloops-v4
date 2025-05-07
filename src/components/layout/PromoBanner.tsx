'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

interface PromoBannerProps {
  message: string;
  endDate: Date;
  variant?: 'default' | 'success' | 'warning';
  link?: string;
  // id supprimé car non utilisé
}

export default function PromoBanner({ 
  message, 
  endDate, 
  variant = 'default', 
  link
  // id supprimé car non utilisé
}: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  // Bannière toujours visible
  const isVisible = true;
  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialiser le montage côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Calculer le temps restant de manière optimisée
  const calculateTimeLeft = useCallback(() => {
    const difference = endDate.getTime() - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      // Si la promo est terminée
      setIsExpired(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }, [endDate]);
  
  // Mettre à jour le temps restant
  useEffect(() => {
    if (!isMounted) return;
    
    // Mettre à jour immédiatement
    setTimeLeft(calculateTimeLeft());
    
    // Mettre à jour toutes les secondes
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Si la promo est expirée, arrêter le timer
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isMounted, calculateTimeLeft]);
  
  // La bannière reste visible même après expiration
  // Nous pourrions ici ajouter une logique pour modifier l'apparence
  // de la bannière lorsque le compte à rebours est terminé
  useEffect(() => {
    // Aucune action nécessaire car la bannière reste toujours visible
  }, [isExpired]);

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

  // Fonction de fermeture supprimée car la bannière est permanente

  // Si pas encore monté côté client, ne rien afficher
  if (!isMounted) {
    return null;
  }

  const bannerContent = (
    <>
      <span className="font-medium">{message}</span>
      <span className="hidden md:inline mx-2">|</span>
      <div className="inline-flex items-center">
        <Clock size={14} className="mr-1 hidden md:inline" />
        <span className="font-mono">
          {timeLeft.days > 0 && (
            <span className="inline-flex items-center mr-1">
              <span>{timeLeft.days}</span>
              <span className="text-xs ml-0.5">j</span>
            </span>
          )}
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="mx-0.5">:</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="mx-0.5">:</span>
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </span>
      </div>
      {/* Lien "Voir" supprimé */}
    </>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          key="promo-banner"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden ${getVariantClasses()}`}
        >
          <div className="py-3 px-4 text-center text-sm font-medium relative">
            <div className="container mx-auto flex flex-col md:flex-row justify-center items-center max-w-7xl">
              {link ? (
                <Link href={link} className="hover:underline flex-1 text-center flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0">
                  {bannerContent}
                </Link>
              ) : (
                <div className="flex-1 text-center flex flex-col md:flex-row justify-center items-center gap-2 md:gap-0">
                  {bannerContent}
                </div>
              )}
              {/* Bouton de fermeture supprimé */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
