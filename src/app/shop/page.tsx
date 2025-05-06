import { Suspense } from 'react';
import { Metadata } from 'next';
import ShopPageContent from '@/components/shop/ShopPageContent';
import ShopPageSkeleton from '@/components/shop/ShopPageSkeleton';

export const metadata: Metadata = {
  title: 'Boutique GlowLoops | Boucles d\'oreilles artisanales',
  description: 'Découvrez notre collection de boucles d\'oreilles artisanales. Filtrez par style, vibe et matériaux pour trouver vos bijoux parfaits.',
};

export default function ShopPage() {
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<ShopPageSkeleton />}>
          <ShopPageContent />
        </Suspense>
      </main>
    </div>
  );
}
