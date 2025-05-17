// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamic = 'force-static';
export const dynamicParams = false;

import { Suspense } from 'react';
import { getNewArrivals, getPopularProducts, convertToProductDisplay } from '@/lib/services/product-service';
import { getActiveCollections } from '@/lib/services/collection-service';
import { getRecentInstagramPosts } from '@/lib/services/instagram-service';
import { getFrequentFaqs } from '@/lib/services/faq-service';
import { getActiveAdvantages } from '@/lib/services/advantages-service';
// Commenté car non utilisé suite à la désactivation de ModernHeroBanner
// import { bannerService } from '@/lib/services/firestore-service';
import { AdvantageIcon } from '@/components/ui/AdvantageIcon';
import { generateHomeSeoMetadata } from '@/lib/utils/seo-helpers';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';

// Import direct des composants sauf ModernHeroBanner (commenté)
// import ModernHeroBanner from '@/components/home/ModernHeroBanner';
import ModernNewArrivalsSlider from '@/components/home/ModernNewArrivalsSlider';
import ModernCollectionsGrid from '@/components/home/ModernCollectionsGrid';
import ModernBestSellersSection from '@/components/home/ModernBestSellersSection';
import ModernInstagramSection from '@/components/home/ModernInstagramSection';
import ModernFaqAccordion from '@/components/home/ModernFaqAccordion';
import ModernNewsletterForm from '@/components/home/ModernNewsletterForm';

// Générer les métadonnées SEO pour la page d'accueil
export const metadata = generateHomeSeoMetadata({
  url: '/',
});

// Utiliser une fonction asynchrone pour charger les données côté serveur
export default async function Home() {
  // Récupération des données
  const [
    newArrivalsData,
    popularProductsData,
    collectionsData,
    instagramPostsData,
    faqsData,
    advantagesData,
    // Commenté car non utilisé suite à la désactivation de ModernHeroBanner
    // heroBannersData
  ] = await Promise.all([
    getNewArrivals(6),
    getPopularProducts(8),
    getActiveCollections(),
    getRecentInstagramPosts(6),
    getFrequentFaqs(5),
    getActiveAdvantages(),
    // Commenté car non utilisé
    // bannerService.getActiveBanners('hero')
  ]);

  // Conversion des données produits
  const newArrivals = newArrivalsData.map(convertToProductDisplay);
  const popularProducts = popularProductsData.map(convertToProductDisplay);

  // Préparation des données avantages avec icônes (filtrage des entrées sans iconName)
  const advantagesWithIcons = advantagesData
    .filter(advantage => typeof advantage.iconName === 'string' && advantage.iconName.length > 0)
    .map(advantage => ({
      id: advantage.id,
      title: advantage.title,
      description: advantage.description,
      icon: <AdvantageIcon iconName={advantage.iconName} />,
      order: advantage.order,
      isActive: advantage.isActive
    }));

  // Filtrer les bannières pour celles qui sont actives
  // const heroBanners = heroBannersData || [];
  // Commenté car non utilisé suite à la désactivation de ModernHeroBanner

  return (
    <div className="min-w-[375px] min-h-screen">
      <OrganizationJsonLd />
      <main>
        {/* HeroBanner remplacé par une section simple */}
        <section className="h-[50vh] flex items-center justify-center bg-lilas-clair/20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 font-display">GlowLoops</h1>
            <p className="text-xl">Des bijoux uniques pour sublimer votre style</p>
          </div>
        </section>

        {/* Nouveautés - Chargement prioritaire car au-dessus de la ligne de flottaison */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernNewArrivalsSlider 
            products={newArrivals} 
            title="Nos nouveautés" 
          />
        </Suspense>

        {/* Best-sellers - Optimisé pour le chargement paresseux */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernBestSellersSection 
            products={popularProducts} 
            title="Nos best-sellers" 
            subtitle="Découvrez nos produits les plus populaires, plébiscités par notre communauté"
          />
        </Suspense>

        {/* Collections - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernCollectionsGrid 
            collections={collectionsData}
            title="Nos collections"
          />
        </Suspense>

        {/* Instagram - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernInstagramSection 
            title="Nos clientes adorent GlowLoops"
            subtitle="Rejoignez notre communauté et partagez vos moments précieux avec nos bijoux"
            instagramPosts={instagramPostsData}
            instagramUsername="glowloops"
          />
        </Suspense>

        {/* FAQ - Accordéon moderne avec animations */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernFaqAccordion 
            faqs={faqsData}
            title="Questions fréquentes"
          />
        </Suspense>

        {/* Newsletter - Formulaire moderne avec validation et animations */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernNewsletterForm 
            title="Restez informée"
            subtitle="Inscrivez-vous à notre newsletter pour recevoir nos dernières nouveautés et offres exclusives"
            buttonText="S'inscrire"
            successMessage="Merci pour votre inscription ! Vous recevrez bientôt nos dernières nouveautés."
          />
        </Suspense>
        
        {/* Avantages - Design moderne avec icônes et animations - Placé avant le footer */}
        <Suspense fallback={<div className="h-64 w-full bg-gray-200 animate-pulse"></div>}>
          <section className="min-w-[375px] py-12 md:py-16 px-4 bg-white border-t border-gray-100 text-gray-800">
            <div className="container mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
                  Pourquoi choisir GlowLoops ?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Des boucles d&apos;oreilles uniques, éthiques et abordables pour sublimer votre style
                </p>
              </div>
              <div className="grid grid-cols-1 min-[700px]:grid-cols-2 lg:grid-cols-5 gap-6 overflow-visible place-items-center">
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
          </section>
        </Suspense>
      </main>
    </div>
  );
}
