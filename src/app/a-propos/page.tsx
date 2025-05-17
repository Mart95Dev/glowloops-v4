import Image from 'next/image';
import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineStar } from 'react-icons/hi';

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* En-tête */}
      <div className="text-center mb-16">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-4">
          Notre Univers GlowLoops ✨
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez qui nous sommes vraiment et pourquoi nos boucles d&apos;oreilles séduisent déjà plus de 10 000 client·e·s en France.
        </p>
      </div>

      {/* Section histoire */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-lilas-fonce font-display">🔍 Notre Vision</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Bienvenue chez GlowLoops, où nous vous proposons des bijoux tendance à prix accessibles pour tous vos styles et toutes vos envies.
              </p>
              <p>
                Sans filtre et avec transparence : nos boucles d&apos;oreilles proviennent des meilleures collections asiatiques. Nous dénichons pour vous les créations les plus stylées et vous les livrons directement, sans intermédiaire.
              </p>
              <p>
                Vous méritez de savoir ce que vous achetez : nos produits sont sourcés avec soin, sélectionnés pour leur rapport qualité-prix exceptionnel, et expédiés dans des délais de 3 à 7 jours depuis nos entrepôts français.
              </p>
              <p>
                Notre objectif ? Vous offrir cette petite touche brillante qui transforme une tenue ordinaire en look extraordinaire, sans vous ruiner.
              </p>
            </div>
          </div>
          <div className="relative h-[350px] md:h-[400px] rounded-lg overflow-hidden order-1 md:order-2">
            <Image
              src="/images/about-story.jpg"
              alt="Collection de boucles d'oreilles GlowLoops présentée sur un plateau en marbre avec ambiance lifestyle élégante"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Section valeurs/engagements */}
      <section className="mb-16 py-16 px-6 bg-gradient-to-b from-white to-creme-nude rounded-xl">
        <h2 className="text-xl md:text-2xl font-semibold mb-12 text-center text-lilas-fonce font-display">💎 Nos Engagements Envers Vous</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-lilas-clair/20 rounded-full flex items-center justify-center mb-4">
              <HiOutlineStar className="w-6 h-6 text-lilas-fonce" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Style Avant-Gardiste</h3>
            <p className="text-gray-600">
              Nouveautés toutes les 2 semaines pour vous garder à la pointe des tendances, avec des styles exclusifs que vous ne trouverez pas ailleurs.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-menthe/20 rounded-full flex items-center justify-center mb-4">
              <HiOutlineHeart className="w-6 h-6 text-menthe" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Prix Juste</h3>
            <p className="text-gray-600">
              Des bijoux tendance à partir de 14,90€ grâce à notre approvisionnement direct. Sublimez votre style sans impacter votre budget.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-dore/20 rounded-full flex items-center justify-center mb-4">
              <HiOutlineLightBulb className="w-6 h-6 text-dore" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Transparence Totale</h3>
            <p className="text-gray-600">
              Origine, matériaux, délais : nous vous disons tout. Nos boucles sont importées d&apos;Asie et sélectionnées pour leur qualité et leur design.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-lilas-clair/20 rounded-full flex items-center justify-center mb-4">
              <HiOutlineHeart className="w-6 h-6 text-lilas-fonce" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Service Client Réactif</h3>
            <p className="text-gray-600">
              Une équipe dédiée pour vous répondre sous 24h et résoudre 95% des questions dès le premier contact. Votre satisfaction est notre priorité.
            </p>
          </div>
        </div>
      </section>

      {/* Section mobile */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-lilas-fonce font-display">📱 Shopping Mobile-First</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Faites vos achats quand vous voulez, où vous voulez. Notre site est optimisé pour vous offrir une expérience fluide sur mobile avec paiement sécurisé et navigation intuitive.
              </p>
              <p>
                Essayez dès maintenant ! En 3 clics, transformez votre look avec une nouvelle paire de boucles qui sublimera votre visage et complètera parfaitement votre style personnel.
              </p>
            </div>
          </div>
          <div className="relative h-[350px] md:h-[400px] rounded-lg overflow-hidden order-1 md:order-2 bg-gray-100 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-lg font-medium text-gray-500 mb-4">Explorez notre boutique en mobilité</p>
              <div className="w-48 h-96 mx-auto border-4 border-gray-300 rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-lilas-clair to-lilas-fonce opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="text-center mt-16">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-lilas-fonce font-display">💫 Rejoignez 10 000+ Passionné·e·s de Bijoux</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Inscrivez-vous maintenant et recevez 10% de réduction sur votre prochaine commande + des offres exclusives réservées à notre communauté.
        </p>
        <a 
          href="/shop" 
          className="inline-block px-6 py-3 bg-lilas-fonce text-white rounded-md hover:bg-lilas-clair transition-colors"
        >
          Découvrez nos collections dès maintenant
        </a>
      </section>
    </div>
  );
} 