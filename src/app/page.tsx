// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamic = 'force-static';
export const dynamicParams = false;

import { Suspense } from 'react';
import { getNewArrivals, getPopularProducts } from '@/lib/services/product-service';
import { getActiveCollections } from '@/lib/services/collection-service';
import { getRecentInstagramPosts } from '@/lib/services/instagram-service';
import { getFrequentFaqs } from '@/lib/services/faq-service';
import { getActiveAdvantages } from '@/lib/services/advantages-service';
import { convertToProductDisplay } from '@/lib/services/product-service';
import { bannerService } from '@/lib/services/firestore-service';
import { AdvantageIcon } from '@/components/ui/AdvantageIcon';
import {
  ModernHeroBanner,
  ModernCollectionsGrid,
  ModernNewArrivalsSlider,
  ModernInstagramSection,
  ModernBestSellersSection,
  ModernFaqAccordion,
  ModernAdvantagesBanner,
  ModernNewsletterForm
} from '@/components/home/modern-index';

export default async function Home() {
  // Récupération des données
  const newArrivalsData = await getNewArrivals(8);
  const collectionsRawData = await getActiveCollections(6);
  // S'assurer que toutes les collections ont une URL d'image valide
  const collectionsData = collectionsRawData.filter(collection => !!collection.imageUrl);
  const popularProductsData = await getPopularProducts(8);
  const instagramPostsData = await getRecentInstagramPosts(6);
  const faqsData = await getFrequentFaqs(5);
  const advantagesData = await getActiveAdvantages(5);
  
  // Récupération de la bannière hero depuis Firestore
  const heroBanners = await bannerService.getActiveBanners('hero');
  
  // Conversion des produits au format d'affichage
  const newArrivals = newArrivalsData.map(convertToProductDisplay);
  const popularProducts = popularProductsData.map(convertToProductDisplay);
  
  // Préparation des avantages avec les icônes
  const advantagesWithIcons = advantagesData.map(advantage => ({
    id: advantage.id,
    title: advantage.title,
    description: advantage.description,
    icon: <AdvantageIcon iconName={advantage.iconName} className="h-8 w-8 text-lilas-fonce" />
  }));

  return (
    <div className="min-w-[375px] min-h-screen">
      <main>
        {/* Hero Banner - Design moderne et immersif */}
        <Suspense fallback={<div className="h-[85vh] w-full bg-gray-200 animate-pulse"></div>}>
          {heroBanners.length > 0 && (
            <ModernHeroBanner 
              title={heroBanners[0].title}
              subtitle={heroBanners[0].subtitle}
              ctaText={heroBanners[0].ctaText}
              ctaLink={heroBanners[0].ctaLink}
              imageUrl={heroBanners[0].imageUrl}
            />
          )}
        </Suspense>

        {/* Nouveautés - Slider moderne avec animations */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernNewArrivalsSlider 
            products={newArrivals}
            title="Nos nouveautés"
          />
        </Suspense>

        {/* Collections - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernCollectionsGrid 
            collections={collectionsData}
            title="Nos collections"
          />
        </Suspense>



        {/* Produits populaires - Grille moderne avec effets au survol */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <ModernBestSellersSection 
            products={popularProducts}
            title="Nos best-sellers"
            subtitle="Découvrez nos bijoux les plus appréciés par nos clientes"
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
          <ModernAdvantagesBanner advantages={advantagesWithIcons} />
        </Suspense>
      </main>
    </div>
  );
}
