// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamic = 'force-static';
export const dynamicParams = false;

// Utiliser la régénération statique incrémentielle (ISR) pour une meilleure performance
export const revalidate = 3600; // Revalider toutes les heures

import { Suspense, lazy } from 'react';
import { getNewArrivals, getPopularProducts, convertToProductDisplay } from '@/lib/services/product-service';
import { getActiveCollections } from '@/lib/services/collection-service';
import { getRecentInstagramPosts } from '@/lib/services/instagram-service';
import { getFrequentFaqs } from '@/lib/services/faq-service';
import { getActiveAdvantages } from '@/lib/services/advantages-service';
import { bannerService } from '@/lib/services/firestore-service';
import { generateHomeSeoMetadata } from '@/lib/utils/seo-helpers';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import { AdvantageIcon } from '@/components/ui/AdvantageIcon';

// Import direct des composants critiques (au-dessus de la ligne de flottaison)
import ModernHeroBanner from '@/components/home/ModernHeroBanner';
import ModernNewArrivalsSlider from '@/components/home/ModernNewArrivalsSlider';

// Import lazy des composants non-critiques (sous la ligne de flottaison)
const ModernBestSellersSection = lazy(() => import('@/components/home/ModernBestSellersSection'));
const ModernCollectionsGrid = lazy(() => import('@/components/home/ModernCollectionsGrid'));
const ModernInstagramSection = lazy(() => import('@/components/home/ModernInstagramSection'));
const ModernFaqAccordion = lazy(() => import('@/components/home/ModernFaqAccordion'));
const ModernNewsletterForm = lazy(() => import('@/components/home/ModernNewsletterForm'));

// Placeholder pour le chargement
const LoadingPlaceholder = ({ height = 'h-96' }: { height?: string }) => (
  <div className={`${height} w-full bg-gray-100 animate-pulse rounded-md`} />
);

// Générer les métadonnées SEO pour la page d'accueil
export const metadata = generateHomeSeoMetadata({
  url: '/',
});

// Utiliser une fonction asynchrone pour charger les données côté serveur
export default async function Home() {
  // Récupération des données prioritaires d'abord (pour les sections au-dessus du pli)
  const [heroBannersData, newArrivalsData] = await Promise.all([
    bannerService.getActiveBanners('hero'),
    getNewArrivals(6),
  ]);

  // Conversion des données produits prioritaires
  const newArrivals = newArrivalsData.map(convertToProductDisplay);

  // Filtrer les bannières pour celles qui sont actives
  const heroBanners = heroBannersData || [];
  
  // Fallback pour les bannières si aucune bannière n'est disponible
  if (heroBanners.length === 0) {
    heroBanners.push({
      id: 'fallback-banner',
      title: 'Bijoux Artisanaux en Résine',
      subtitle: 'Des créations uniques et personnalisables qui subliment votre style',
      ctaText: 'Découvrir nos collections',
      ctaLink: '/collections',
      imageUrl: '/images/default-banner.png',
      type: 'hero',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      isActive: true,
      order: 1
    });
  }

  return (
    <div className="min-w-[375px] min-h-screen">
      <OrganizationJsonLd />
      <main>
        {/* Section prioritaire 1: Hero Banner - Chargement prioritaire */}
        <section id="hero">
          {heroBanners.length > 0 && (
            <ModernHeroBanner 
              title={heroBanners[0].title}
              subtitle={heroBanners[0].subtitle}
              ctaText={heroBanners[0].ctaText}
              ctaLink={heroBanners[0].ctaLink}
              imageUrl={heroBanners[0].imageUrl}
            />
          )}
        </section>

        {/* Section prioritaire 2: Nouveautés - Chargement prioritaire */}
        <section id="nouveautes">
          <ModernNewArrivalsSlider 
            products={newArrivals} 
            title="Nos nouveautés" 
          />
        </section>

        {/* Sections non prioritaires avec lazy loading et suspense */}

        {/* Section 3: Best-sellers - Lazy loading */}
        <section id="bestsellers">
          <Suspense fallback={<LoadingPlaceholder height="h-96" />}>
            <PopularProductsSection />
          </Suspense>
        </section>

        {/* Section 4: Collections - Lazy loading */}
        <section id="collections">
          <Suspense fallback={<LoadingPlaceholder height="h-96" />}>
            <CollectionsSection />
          </Suspense>
        </section>

        {/* Section 5: Instagram - Lazy loading */}
        <section id="instagram" data-testid="instagram-section">
          <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
            <InstagramSection />
          </Suspense>
        </section>

        {/* Section 6: FAQ - Lazy loading */}
        <section id="faq">
          <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
            <FaqSection />
          </Suspense>
        </section>

        {/* Section 7: Newsletter - Lazy loading */}
        <section id="newsletter">
          <Suspense fallback={<LoadingPlaceholder height="h-64" />}>
            <ModernNewsletterForm 
              title="Restez informée"
              subtitle="Inscrivez-vous à notre newsletter pour recevoir nos dernières nouveautés et offres exclusives"
              buttonText="S'inscrire"
              successMessage="Merci pour votre inscription ! Vous recevrez bientôt nos dernières nouveautés."
            />
          </Suspense>
        </section>
        
        {/* Section 8: Avantages - Lazy loading */}
        <section id="avantages">
          <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
            <AdvantagesSection />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

// Composants de sections séparés pour permettre le code-splitting et le chargement différé
async function PopularProductsSection() {
  const popularProductsData = await getPopularProducts(8);
  const popularProducts = popularProductsData.map(convertToProductDisplay);
  
  return (
    <ModernBestSellersSection 
      products={popularProducts} 
      title="Nos best-sellers" 
      subtitle="Découvrez nos produits les plus populaires, plébiscités par notre communauté"
    />
  );
}

async function CollectionsSection() {
  const collectionsData = await getActiveCollections();
  
  return (
    <ModernCollectionsGrid 
      collections={collectionsData}
      title="Nos collections"
    />
  );
}

async function InstagramSection() {
  const instagramPostsData = await getRecentInstagramPosts(6);
  
  return (
    <ModernInstagramSection 
      title="Nos clientes adorent GlowLoops"
      subtitle="Rejoignez notre communauté et partagez vos moments précieux avec nos bijoux"
      instagramPosts={instagramPostsData}
      instagramUsername="glowloops"
    />
  );
}

async function FaqSection() {
  const faqsData = await getFrequentFaqs(5);
  
  return (
    <ModernFaqAccordion 
      faqs={faqsData}
      title="Questions fréquentes"
    />
  );
}

async function AdvantagesSection() {
  const advantagesData = await getActiveAdvantages();
  
  // Préparation des données avantages avec icônes (filtrage des entrées sans iconName)
  const advantagesWithIcons = advantagesData
    .filter(advantage => typeof advantage.iconName === 'string' && advantage.iconName.length > 0)
    .map(advantage => ({
      id: advantage.id,
      title: advantage.title,
      description: advantage.description,
      icon: <AdvantageIcon iconName={advantage.iconName as string} />,
      order: advantage.order,
      isActive: advantage.isActive
  }));

  // Déterminer la configuration de la grille en fonction du nombre d'avantages
  const getGridCols = (count: number) => {
    // Pour 3 avantages : 1 sur mobile, 3 sur tablette et desktop
    if (count === 3) return 'grid-cols-1 min-[700px]:grid-cols-3';
    // Pour 4 avantages : 1 sur mobile, 2 sur tablette, 4 sur desktop
    if (count === 4) return 'grid-cols-1 min-[700px]:grid-cols-2 lg:grid-cols-4';
    // Par défaut (5 avantages) : 1 sur mobile, 2 sur tablette, 5 sur desktop
    return 'grid-cols-1 min-[700px]:grid-cols-2 lg:grid-cols-5';
  };
  
  return (
    <div className="min-w-[375px] py-12 md:py-16 px-4 bg-white border-t border-gray-100 text-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
            Pourquoi choisir GlowLoops ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des boucles d&apos;oreilles uniques, éthiques et abordables pour sublimer votre style
          </p>
        </div>
        
        {/* Grille adaptative en fonction du nombre d'avantages */}
        <div className={`grid ${getGridCols(advantagesWithIcons.length)} gap-6 overflow-visible place-items-center justify-center max-w-6xl mx-auto`}>
          {advantagesWithIcons.map((advantage) => (
            <div 
              key={advantage.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-[280px] md:w-auto snap-center"
            >
              <div className="bg-dore rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-center font-display">{advantage.title}</h3>
              <p className="text-gray-600 text-center text-sm">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
