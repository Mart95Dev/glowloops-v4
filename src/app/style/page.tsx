import { Metadata } from 'next';
import { Suspense } from 'react';
import StylePageContent from './StylePageContent';
import StylePageSkeleton from './StylePageSkeleton';

export const metadata: Metadata = {
  title: 'Style | GlowLoops',
  description: 'Découvrez notre collection de bijoux par style - créoles, mini-hoops, ear cuffs et plus encore.',
};

export default function StylePage() {
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<StylePageSkeleton />}>
          <StylePageContent />
        </Suspense>
      </main>
    </div>
  );
} 