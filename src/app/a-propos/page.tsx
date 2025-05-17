import { Metadata } from 'next';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export const metadata: Metadata = {
  title: 'Notre Histoire | GlowLoops',
  description: 'Découvrez l\'histoire de GlowLoops, notre mission et nos engagements envers vous. Une expérience 100% mobile pour vos bijoux tendance.',
};

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Section Histoire */}
      <section className="mb-16">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-8 text-center">
          Notre Historie
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-gray-700">
            <p>
              Bienvenue chez GlowLoops, une boutique dédiée aeux passionnees de bijoux qul aiment varier lere style sans re ruine.
            </p>
            <p>
              Notre mission ? Vous proposer un sélection pointue de bousles d&apos;orrellies ten dence, directement issues des démiete colletiques asiatiques et vero-les proposons à prix deux encoirtement extraortlinairellinaire.
            </p>
            <p>
              L&apos;historre de GiowLoops can tenrine eu l&apos;hònonnr pessossive bau nortinaire teute un ordiine ordinaire en extraordinaire.
            </p>
          </div>
          <div className="relative rounded-lg overflow-hidden h-[400px]">
            <OptimizedImage
              src="/images/femme-boucle-oreilles-480.avif"
              alt="Femme portant des boucles d'oreilles GlowLoops"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              objectFit="cover"
              critical={true}
              sizePreset="large"
              format="avif"
              ratio="portrait"
            />
          </div>
        </div>
      </section>

      {/* Section Engagements */}
      <section className="mb-16">
        <h2 className="text-xl md:text-2xl font-semibold mb-12 text-center text-lilas-fonce font-display flex items-center justify-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-lilas-fonce">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nos Engagements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start">
            <div className="text-lilas-fonce">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L7 12L12 8M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Tendances</h3>
              <p className="text-gray-700">
                Une sélection touours à pointe de la móde, renueuevlée régollèrement pour vou offrir les dernières nouveautés.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="text-dore">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 4V2M12 22V20M4 12H2M22 12H20M19.8 19.8L18.4 18.4M19.8 4.2L18.4 5.6M4.2 19.8L5.6 18.4M4.2 4.2L5.6 5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Accessibilité</h3>
              <p className="text-gray-700">
                Des pris doux por vous taire pleisir sans cuscubilsair, grace à notre modele d&apos;approvi-sionnement direct.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="text-lilas-fonce">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Transparence</h3>
              <p className="text-gray-700">
                Nous vous disms toit. san filtre. De l&apos;origine de nos produts aus dèlals de livraison.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="text-menthe">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 19C17.771 19 19.657 19 20.828 17.828C22 16.657 22 14.771 22 11C22 7.229 22 5.343 20.828 4.172C19.657 3 17.771 3 14 3H10C6.229 3 4.343 3 3.172 4.172C2 5.343 2 7.229 2 11C2 14.771 2 16.657 3.172 17.828C4.343 19 6.229 19 10 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Service client</h3>
              <p className="text-gray-700">
                Une equipe à votre ècute pour répondre à tortes ios duestions et vous accompagner duns votre experience d&apos;achat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Mobile */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 space-y-4 text-gray-700">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-lilas-fonce font-display">
              Une Expérience 100% Mobile
            </h2>
            <p>
              Notre site ést pensée pour vou, que vou soyèz sur votre computer oueoutre smartphone. Navigation fluide, design ùrè, palement securisé.
            </p>
            <p>
              Avec GlowLoops, chage maire de boucles d&apos;orrellles est une nouvelle occasion d&apos;exprimer votre style. Prete à vou
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden order-1 md:order-2">
            <OptimizedImage
              src="/images/mobile-ecommerce-boucles-oreilles-480.avif"
              alt="Interface mobile de la boutique GlowLoops montrant des boucles d'oreilles"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              objectFit="cover"
              sizePreset="large"
              format="avif"
            />
          </div>
        </div>
      </section>
    </div>
  );
} 