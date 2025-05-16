import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { navigationData } from '@/lib/data/navigation-data';
import SubcategoryPageContent from './SubcategoryPageContent';
import VibePageSkeleton from '../VibePageSkeleton';

interface VibeSubcategoryPageProps {
  params: {
    subcategory: string;
  };
}

export async function generateMetadata({ params }: VibeSubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = params;
  
  // Trouver la catégorie Vibe dans les données de navigation
  const vibeCategory = navigationData.find(category => category.name === 'Vibe');
  
  // Trouver la sous-catégorie correspondante
  const subcategoryData = vibeCategory?.subcategories?.find(
    sub => sub.href === `/vibe/${subcategory}`
  );
  
  if (!subcategoryData) {
    return {
      title: 'Catégorie non trouvée | GlowLoops',
      description: 'La catégorie que vous recherchez n\'existe pas.',
    };
  }
  
  return {
    title: `${subcategoryData.name} | Vibe | GlowLoops`,
    description: `Découvrez notre collection de bijoux avec la vibe ${subcategoryData.name.toLowerCase()}.`,
  };
}

export async function generateStaticParams() {
  const vibeCategory = navigationData.find(category => category.name === 'Vibe');
  const subcategories = vibeCategory?.subcategories || [];
  
  return subcategories.map(subcategory => ({
    subcategory: subcategory.href.split('/').pop(),
  }));
}

export default function VibeSubcategoryPage({ params }: VibeSubcategoryPageProps) {
  const { subcategory } = params;
  
  // Vérifier si la sous-catégorie existe
  const vibeCategory = navigationData.find(category => category.name === 'Vibe');
  const subcategoryData = vibeCategory?.subcategories?.find(
    sub => sub.href === `/vibe/${subcategory}`
  );
  
  if (!subcategoryData) {
    notFound();
  }
  
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<VibePageSkeleton />}>
          <SubcategoryPageContent subcategory={subcategory} />
        </Suspense>
      </main>
    </div>
  );
} 