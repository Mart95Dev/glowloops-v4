import { Suspense } from 'react';
import { Metadata } from 'next';
import { getProductWithImages } from '@/lib/services/product-service';
import ProductPageContent from '@/components/product/ProductPageContent';
import ProductPageSkeleton from '@/components/product/ProductPageSkeleton';

type Props = {
  params: { id: string };
};

// Génération des métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await getProductWithImages(params.id);
  
  if (!product) {
    return {
      title: 'Produit non trouvé | GlowLoops',
      description: 'Le produit que vous recherchez n\'existe pas ou a été supprimé.'
    };
  }
  
  return {
    title: `${product.basic_info?.name || 'Produit'} | GlowLoops`,
    description: product.content?.short_description || 'Découvrez nos boucles d\'oreilles artisanales de qualité.',
    openGraph: {
      images: [product.media?.mainImageUrl || ''],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const productId = params.id;
  
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<ProductPageSkeleton />}>
          <ProductPageContent productId={productId} />
        </Suspense>
      </main>
    </div>
  );
}
