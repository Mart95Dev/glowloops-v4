import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart-store';

interface CartButtonClassicProps {
  itemCount?: number; // Rendu optionnel pour compatibilité avec le code existant
}

export const CartButtonClassic = ({ itemCount: propItemCount }: CartButtonClassicProps) => {
  const router = useRouter();
  const controls = useAnimation();
  const [isMounted, setIsMounted] = useState(false);
  
  // Obtenir le nombre d'articles directement depuis le store
  const storeItemCount = useCartStore((state) => state.totalItems);
  
  // Utiliser la prop ou la valeur du store
  const itemCount = propItemCount !== undefined ? propItemCount : storeItemCount;
  
  const [previousCount, setPreviousCount] = useState(0);
  
  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Animation lorsque le nombre d'articles change
  useEffect(() => {
    if (!isMounted) return;
    
    if (itemCount !== previousCount) {
      // Animer l'icône du panier
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      });
      
      setPreviousCount(itemCount);
    }
  }, [itemCount, previousCount, controls, isMounted]);
  
  const handleCartClick = () => {
    router.push('/panier');
  };
  
  // Si le composant n'est pas encore monté côté client, afficher une version statique
  if (!isMounted) {
    return (
      <button 
        className="hover:text-lilas-fonce transition-colors p-2 rounded-full hover:bg-lilas-clair/10 relative min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Voir mon panier"
      >
        <ShoppingBag size={22} />
      </button>
    );
  }
  
  return (
    <button 
      onClick={handleCartClick}
      className="hover:text-lilas-fonce transition-colors p-2 rounded-full hover:bg-lilas-clair/10 relative min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label="Voir mon panier"
    >
      <motion.div animate={controls}>
        <ShoppingBag size={22} />
        {itemCount > 0 && (
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 bg-menthe text-black text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </motion.div>
    </button>
  );
};

export default CartButtonClassic; 