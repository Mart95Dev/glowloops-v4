'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart-store';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  inventory?: Record<string, number>;
  selectedVariant?: string;
  quantity: number;
  setQuantity?: (quantity: number) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  text?: string;
  onlyIcon?: boolean;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  selectedVariant,
  quantity,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  text = 'Ajouter au panier',
  onlyIcon = false,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Animation de délai pour l'effet visuel
    setTimeout(() => {
      addItem({
        productId,
        name,
        price,
        image: image || '',
        quantity,
        color: selectedVariant
      });
      
      setIsAdding(false);
      toast.success('Produit ajouté au panier !');
    }, 300);
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        size={size}
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`${className} ${isAdding ? 'opacity-80' : ''}`}
      >
        {showIcon && (
          onlyIcon 
            ? <ShoppingCart className="w-4 h-4" />
            : <ShoppingCart className={`w-4 h-4 ${!onlyIcon ? 'mr-2' : ''}`} />
        )}
        {!onlyIcon && text}
      </Button>
    </motion.div>
  );
} 