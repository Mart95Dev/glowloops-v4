'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '@/components/ui/auth-modal';

interface FavoritesButtonProps {
  count: number;
}

export const FavoritesButton = ({ count }: FavoritesButtonProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [animateCount, setAnimateCount] = useState(false);
  const [prevCount, setPrevCount] = useState(count);
  
  // Détecter les changements de compteur pour déclencher l'animation
  useEffect(() => {
    if (prevCount !== count) {
      setAnimateCount(true);
      const timeout = setTimeout(() => setAnimateCount(false), 500);
      setPrevCount(count);
      return () => clearTimeout(timeout);
    }
  }, [count, prevCount]);

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (user) {
      // Utilisateur connecté, rediriger vers la page des favoris
      router.push('/mon-compte/favoris');
    } else {
      // Utilisateur non connecté, afficher la modal d'authentification
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <button 
        onClick={handleFavoritesClick}
        className="relative text-gray-700 hover:text-lilas-fonce transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center"
        aria-label="Favoris"
      >
        <Heart size={20} />
        <AnimatePresence>
          {count > 0 && (
            <motion.span 
              className="absolute -top-1 -right-1 bg-lilas-fonce text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              initial={{ scale: animateCount ? 0.8 : 1 }}
              animate={{ scale: animateCount ? [0.8, 1.3, 1] : 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Connectez-vous pour accéder à vos favoris et créer votre wishlist"
      />
    </>
  );
};

export default FavoritesButton;
