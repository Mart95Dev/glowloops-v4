import { ProductDisplay } from '@/lib/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: ProductDisplay[];
  title: string;
}

export const ProductGrid = ({ products, title }: ProductGridProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold">{title}</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500">Aucun produit disponible.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
