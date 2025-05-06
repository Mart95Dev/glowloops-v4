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
  HeroBanner,
  CollectionsGrid,
  NewArrivalsSlider,
  InstagramSection,
  BestSellersSection,
  FaqAccordion,
  AdvantagesBanner,
  NewsletterForm
} from '@/components/home';

export default async function Home() {
  // Récupération des données
  const newArrivalsData = await getNewArrivals(8);
  const collectionsData = await getActiveCollections(6);
  const popularProductsData = await getPopularProducts(8);
  const instagramPostsData = await getRecentInstagramPosts(6);
  const faqsData = await getFrequentFaqs(5);
  const advantagesData = await getActiveAdvantages(3);
  // Récupération de la bannière hero depuis Firestore
  const heroBanners = await bannerService.getActiveBanners('hero');
  console.log('Bannières récupérées:', heroBanners);
  
  // Conversion des produits au format d'affichage
  const newArrivals = newArrivalsData.map(convertToProductDisplay);
  const popularProducts = popularProductsData.map(convertToProductDisplay);
  
  // Préparation des avantages avec les icônes
  const advantagesWithIcons = advantagesData.map(advantage => ({
    id: advantage.id,
    title: advantage.title,
    description: advantage.description,
    icon: <AdvantageIcon iconName={advantage.iconName} className="h-8 w-8 text-white" />
  }));

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Banner */}
        <Suspense fallback={<div className="h-[80vh] w-full bg-gray-200 animate-pulse"></div>}>
          {heroBanners.length > 0 && (
            <HeroBanner 
              title={heroBanners[0].title}
              subtitle={heroBanners[0].subtitle}
              ctaText={heroBanners[0].ctaText}
              ctaLink={heroBanners[0].ctaLink}
              imageUrl={heroBanners[0].imageUrl}
            />
          )}
        </Suspense>

        {/* Nouveautés */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <NewArrivalsSlider 
            products={newArrivals}
            title="Nos nouveautés"
          />
        </Suspense>

        {/* Collections */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <CollectionsGrid 
            collections={collectionsData}
            title="Nos collections"
          />
        </Suspense>

        {/* Avantages */}
        <Suspense fallback={<div className="h-64 w-full bg-gray-200 animate-pulse"></div>}>
          <AdvantagesBanner advantages={advantagesWithIcons} />
        </Suspense>

        {/* Produits populaires */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <BestSellersSection 
            products={popularProducts}
            title="Nos best-sellers"
            subtitle="Découvrez nos bijoux les plus appréciés par nos clientes"
          />
        </Suspense>

        {/* Instagram */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <InstagramSection 
            title="Nos clientes adorent GlowLoops"
            subtitle="Rejoignez notre communauté et partagez vos moments précieux avec nos bijoux"
            instagramPosts={instagramPostsData}
            instagramUsername="glowloops"
          />
        </Suspense>

        {/* FAQ */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <FaqAccordion 
            faqs={faqsData}
            title="Questions fréquentes"
          />
        </Suspense>

        {/* Newsletter */}
        <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse"></div>}>
          <NewsletterForm 
            title="Restez informé"
            subtitle="Inscrivez-vous à notre newsletter pour recevoir nos dernières nouveautés et offres exclusives"
            buttonText="S'inscrire"
            successMessage="Merci pour votre inscription ! Vous recevrez bientôt nos dernières nouveautés."
          />
        </Suspense>
      </main>
    </div>
  );
}
