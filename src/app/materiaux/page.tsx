import { Metadata } from 'next';
import { Suspense } from 'react';
import MateriauxPageContent from './MateriauxPageContent';
import MateriauxPageSkeleton from './MateriauxPageSkeleton';

export const metadata: Metadata = {
  title: 'Matériaux | GlowLoops',
  description: 'Découvrez notre collection de bijoux par matériau - résine, acier inoxydable, plaqué or et plus encore.',
};

export default function MateriauxPage() {
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<MateriauxPageSkeleton />}>
          <MateriauxPageContent />
        </Suspense>
      </main>
    </div>
  );
} 