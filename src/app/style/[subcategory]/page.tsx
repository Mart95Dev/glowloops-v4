import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { navigationData } from '@/lib/data/navigation-data';
import SubcategoryPageContent from './SubcategoryPageContent';
import StylePageSkeleton from '../StylePageSkeleton';

interface StyleSubcategoryPageProps {
  params: {
    subcategory: string;
  };
}

export async function generateMetadata({ params }: StyleSubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = params;
  
  // Trouver la catégorie Style dans les données de navigation
  const styleCategory = navigationData.find(category => category.name === 'Style');
  
  // Trouver la sous-catégorie correspondante
  const subcategoryData = styleCategory?.subcategories?.find(
    sub => sub.href === `/style/${subcategory}`
  );
  
  if (!subcategoryData) {
    return {
      title: 'Catégorie non trouvée | GlowLoops',
      description: 'La catégorie que vous recherchez n\'existe pas.',
    };
  }
  
  return {
    title: `${subcategoryData.name} | Style | GlowLoops`,
    description: `Découvrez notre collection de boucles d'oreilles ${subcategoryData.name.toLowerCase()}.`,
  };
}

export async function generateStaticParams() {
  const styleCategory = navigationData.find(category => category.name === 'Style');
  const subcategories = styleCategory?.subcategories || [];
  
  return subcategories.map(subcategory => ({
    subcategory: subcategory.href.split('/').pop(),
  }));
}

export default function StyleSubcategoryPage({ params }: StyleSubcategoryPageProps) {
  const { subcategory } = params;
  
  // Vérifier si la sous-catégorie existe
  const styleCategory = navigationData.find(category => category.name === 'Style');
  const subcategoryData = styleCategory?.subcategories?.find(
    sub => sub.href === `/style/${subcategory}`
  );
  
  if (!subcategoryData) {
    notFound();
  }
  
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<StylePageSkeleton />}>
          <SubcategoryPageContent subcategory={subcategory} />
        </Suspense>
      </main>
    </div>
  );
} 