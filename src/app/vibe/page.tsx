import { Metadata } from 'next';
import { Suspense } from 'react';
import VibePageContent from './VibePageContent';
import VibePageSkeleton from './VibePageSkeleton';

export const metadata: Metadata = {
  title: 'Vibe | GlowLoops',
  description: 'Découvrez notre collection de bijoux par vibe - chic, bold, casual, bohème et plus encore.',
};

export default function VibePage() {
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<VibePageSkeleton />}>
          <VibePageContent />
        </Suspense>
      </main>
    </div>
  );
} 