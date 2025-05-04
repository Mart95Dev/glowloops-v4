import { Heart } from 'lucide-react';
import Link from 'next/link';

interface FavoritesButtonProps {
  count: number;
}

export const FavoritesButton = ({ count }: FavoritesButtonProps) => {
  return (
    <Link 
      href="/favoris" 
       className="text-gray-700 hover:text-lilas-fonce transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center"
      aria-label="Favoris"
    >
      <Heart size={20}/>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-lilas-fonce text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
};

export default FavoritesButton;
