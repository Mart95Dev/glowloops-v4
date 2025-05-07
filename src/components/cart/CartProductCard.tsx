import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CartItem } from '@/lib/store/cart-store';

interface CartProductCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  motionEnabled?: boolean;
  compact?: boolean;
}

const CartProductCard: React.FC<CartProductCardProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  motionEnabled = true,
  compact = false
}) => {
  const Wrapper = motionEnabled ? motion.div : 'div';
  const motionProps = motionEnabled 
    ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }
    : {};

  return (
  
    <Wrapper 
      className={`py-4 ${compact ? 'py-2' : 'first:pt-0 last:pb-0'}`}
      {...motionProps}
    >
      <div className="flex gap-3">
        {/* Image du produit */}
        <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} bg-gray-100 rounded-md overflow-hidden flex-shrink-0`}>
          <div className="relative w-full h-full">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Informations du produit */}
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className={`${compact ? 'text-sm' : 'text-base'} font-medium`}>{item.name}</h3>
            <p className="font-medium">{(item.price * item.quantity).toFixed(2)}€</p>
          </div>
          
          {/* Afficher les options du produit */}
          {item.color && (
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              Couleur: {item.color}
            </p>
          )}
          
          {item.garantie && (
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500`}>
              Garantie: {item.garantie.name} (+{item.garantie.price.toFixed(2)}€)
            </p>
          )}
          
          {/* Contrôles de quantité */}
          <div className={`flex items-center justify-between ${compact ? 'mt-1' : 'mt-2'}`}>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className={`${compact ? 'px-1.5' : 'px-2'} py-1 hover:bg-gray-100 text-gray-700`}
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span className={`${compact ? 'px-1.5' : 'px-2'} py-1 text-sm`}>
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className={`${compact ? 'px-1.5' : 'px-2'} py-1 hover:bg-gray-100 text-gray-700`}
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            
            {/* Bouton de suppression */}
            <button
              onClick={() => onRemove(item.id)}
              className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 hover:text-red-500 transition-colors`}
              aria-label="Supprimer"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CartProductCard; 