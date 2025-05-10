import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  isAvailable: boolean;
}

interface FavoriteItemProps {
  product: FavoriteProduct;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export function FavoriteItem({ product, onRemove, onAddToCart }: FavoriteItemProps) {
  return (
    <div className="flex border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
      {/* Image du produit */}
      <Link 
        href={`/produits/${product.slug}`} 
        className="flex-shrink-0 w-20 h-20 relative"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>
      
      {/* Informations du produit */}
      <div className="flex-1 p-3 flex flex-col">
        <div className="flex justify-between">
          <Link 
            href={`/produits/${product.slug}`}
            className="font-medium text-sm text-gray-800 hover:text-lilas-fonce"
          >
            {product.name}
          </Link>
          
          <button
            onClick={() => onRemove(product.id)}
            className="text-gray-400 hover:text-red-500"
            aria-label={`Retirer ${product.name} des favoris`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
        
        <div className="mt-1 text-sm font-medium">
          {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </div>
        
        <div className="mt-auto pt-2 flex justify-between items-center">
          <span className={`text-xs ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {product.isAvailable ? 'En stock' : 'Indisponible'}
          </span>
          
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={!product.isAvailable}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              product.isAvailable 
                ? 'bg-lilas-fonce text-white hover:bg-lilas-clair' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
} 