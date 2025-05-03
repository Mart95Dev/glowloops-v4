// Composant de carte produit
import { ProductDisplay } from '@/lib/types/product';

interface ProductCardProps {
  product: ProductDisplay;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback en cas d'erreur de chargement d'image
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=Image+non+disponible';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="mt-1 text-gray-700">{product.price.toFixed(2)} €</p>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {product.category && (
            <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
              {product.category}
            </span>
          )}
          
          {product.isNew && (
            <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              Nouveau
            </span>
          )}
          
          {product.popularity && product.popularity > 60 && (
            <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              Populaire
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
