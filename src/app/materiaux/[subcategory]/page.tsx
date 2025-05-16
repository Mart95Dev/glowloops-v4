import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { navigationData } from '@/lib/data/navigation-data';
import SubcategoryPageContent from './SubcategoryPageContent';
import MateriauxPageSkeleton from '../MateriauxPageSkeleton';

interface MateriauxSubcategoryPageProps {
  params: {
    subcategory: string;
  };
}

export async function generateMetadata({ params }: MateriauxSubcategoryPageProps): Promise<Metadata> {
  const { subcategory } = params;
  
  // Trouver la catégorie Matériaux dans les données de navigation
  const materiauxCategory = navigationData.find(category => category.name === 'Matériaux');
  
  // Trouver la sous-catégorie correspondante
  const subcategoryData = materiauxCategory?.subcategories?.find(
    sub => sub.href === `/materiaux/${subcategory}`
  );
  
  if (!subcategoryData) {
    return {
      title: 'Catégorie non trouvée | GlowLoops',
      description: 'La catégorie que vous recherchez n\'existe pas.',
    };
  }
  
  return {
    title: `${subcategoryData.name} | Matériaux | GlowLoops`,
    description: `Découvrez notre collection de bijoux en ${subcategoryData.name.toLowerCase()}.`,
  };
}

export async function generateStaticParams() {
  const materiauxCategory = navigationData.find(category => category.name === 'Matériaux');
  const subcategories = materiauxCategory?.subcategories || [];
  
  return subcategories.map(subcategory => ({
    subcategory: subcategory.href.split('/').pop(),
  }));
}

export default function MateriauxSubcategoryPage({ params }: MateriauxSubcategoryPageProps) {
  const { subcategory } = params;
  
  // Vérifier si la sous-catégorie existe
  const materiauxCategory = navigationData.find(category => category.name === 'Matériaux');
  const subcategoryData = materiauxCategory?.subcategories?.find(
    sub => sub.href === `/materiaux/${subcategory}`
  );
  
  if (!subcategoryData) {
    notFound();
  }
  
  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        <Suspense fallback={<MateriauxPageSkeleton />}>
          <SubcategoryPageContent subcategory={subcategory} />
        </Suspense>
      </main>
    </div>
  );
} 