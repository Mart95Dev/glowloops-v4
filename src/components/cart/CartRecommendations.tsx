import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types/product';

interface CartRecommendationsProps {
  products: Product[];
  title?: string;
  maxItems?: number;
}

const CartRecommendations: React.FC<CartRecommendationsProps> = ({
  products,
  title = "Vous pourriez aussi aimer",
  maxItems = 4
}) => {
  // Ne rien afficher si pas de produits
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-playfair mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, maxItems).map((product) => (
          <Link 
            key={product.id} 
            href={`/produits/${product.basic_info?.slug || product.id}`}
            className="block"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.media?.mainImageUrl || '/images/placeholder-product.jpg'}
                  alt={product.basic_info?.name || 'Produit'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium truncate">
                  {product.basic_info?.name || 'Produit sans nom'}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-lilas-fonce">
                    {product.pricing?.regular_price?.toFixed(2)}€
                  </p>
                  {product.isNew && (
                    <span className="bg-lilas-clair text-lilas-fonce text-xs px-2 py-0.5 rounded-full">
                      Nouveau
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CartRecommendations; 