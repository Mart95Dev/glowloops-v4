'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/firebase/auth';
import { useFavoritesStore, useFavoritesCount } from '@/lib/store/favoritesStore';
import { toast } from '@/lib/utils/toast';
import AuthModal from '@/components/ui/auth-modal';

interface FavoriteToggleProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  displayStyle?: 'button' | 'icon';
  color?: 'lilas' | 'red' | 'gray';
}

export function FavoriteToggle({
  productId,
  productName,
  productPrice,
  productImage,
  size = 'md',
  className = '',
  displayStyle = 'icon',
  color = 'lilas'
}: FavoriteToggleProps) {
  const { user } = useAuth();
  const { items, addItem, removeItem, syncWithFirebase } = useFavoritesStore();
  const { refreshCount } = useFavoritesCount();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [forcedUpdate, setForcedUpdate] = useState(0);
  
  // Force refresh quand le composant est monté
  useEffect(() => {
    if (user) {
      // Synchroniser avec Firebase au montage du composant
      syncWithFirebase().then(() => {
        refreshCount();
      });
    }
  }, [user, syncWithFirebase, refreshCount, forcedUpdate]);
  
  // Vérifier si le produit est déjà dans les favoris
  const isInFavorites = items.some(item => item.id === productId);
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsAnimating(true);
    
    try {
      if (isInFavorites) {
        // Retirer des favoris
        await removeItem(productId);
        // S'assurer que le compteur est à jour immédiatement
        await refreshCount();
        
        // Dispatch l'événement favoritesUpdated de manière plus fiable
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
          detail: { action: 'remove', productId } 
        }));
        
        toast.success('Produit retiré des favoris');
      } else {
        // Ajouter aux favoris
        await addItem({
          id: productId,
          nom: productName,
          prix: productPrice,
          image: productImage
        });
        // S'assurer que le compteur est à jour immédiatement
        await refreshCount();
        
        // Dispatch l'événement favoritesUpdated de manière plus fiable
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
          detail: { action: 'add', productId } 
        }));
        
        toast.success('Produit ajouté aux favoris');
      }
      
      // Force un refresh du composant
      setForcedUpdate(prev => prev + 1);
      
      // Dispatch un second événement après un court délai pour garantir la prise en compte
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('favoritesCountUpdated', {
          detail: { count: items.length + (isInFavorites ? -1 : 1) }
        }));
      }, 100);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  // Tailles basées sur le paramètre size
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  // Couleurs basées sur le paramètre color
  const colorVariants = {
    lilas: isInFavorites ? 'text-lilas-fonce fill-lilas-fonce' : 'text-gray-500 hover:text-lilas-fonce',
    red: isInFavorites ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-400',
    gray: isInFavorites ? 'text-gray-800 fill-gray-800' : 'text-gray-500 hover:text-gray-800'
  };
  
  // Classes pour le style du bouton
  const buttonStyles = {
    icon: 'p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors',
    button: isInFavorites 
      ? 'px-3 py-1.5 rounded-full bg-white border border-lilas-fonce text-lilas-fonce flex items-center gap-1 text-xs'
      : 'px-3 py-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-lilas-fonce hover:text-lilas-fonce flex items-center gap-1 text-xs'
  };

  return (
    <>
      <motion.button
        onClick={handleToggleFavorite}
        className={`${buttonStyles[displayStyle]} ${className}`}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        aria-label={isInFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Heart className={`${sizeClasses[size]} ${colorVariants[color]}`} />
        
        {displayStyle === 'button' && (
          <span>{isInFavorites ? 'Retirer' : 'Favoris'}</span>
        )}
      </motion.button>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Connectez-vous pour ajouter ce produit à vos favoris"
      />
    </>
  );
} 