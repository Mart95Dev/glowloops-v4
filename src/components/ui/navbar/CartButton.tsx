import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface CartButtonProps {
  itemCount: number;
}

export const CartButton = ({ itemCount }: CartButtonProps) => {
  return (
    <Link 
      href="/panier" 
      className="text-white hover:text-creme-nude transition-colors p-2 rounded-full hover:bg-lilas-clair relative min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label="Panier"
    >
      <ShoppingBag size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-lilas-fonce text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
