'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown, HiOutlineSearch, HiLightBulb, HiSparkles, HiThumbUp } from 'react-icons/hi';
import { faqsData } from '@/lib/data/faqs-data';

// Catégories de FAQ avec leurs traductions
const categories = [
  { id: 'all', label: 'Toutes les questions' },
  { id: 'livraison', label: '🚚 Livraison' },
  { id: 'produits', label: '💎 Produits' },
  { id: 'entretien', label: '✨ Entretien' },
  { id: 'retours', label: '↩️ Retours' },
  { id: 'commande', label: '🛍️ Commande' },
];

// Histoires client·e·s pour chaque catégorie
// const clientStories = {
//   'livraison': {
//     name: 'Julie M.',
//     story: 'Les boucles d&apos;oreilles sont arrivées parfaitement emballées, dans leur jolie boîte en velours protectrice. J&apos;ai adoré découvrir la carte manuscrite de l&apos;artisane !',
//     image: '/images/avatar-chatbot/avatar2.jpg'
//   },
//   'produits': {
//     name: 'Aurélie L.',
//     story: 'Mes mini-hoops en argent sont hypoallergéniques comme promis ! Je les porte depuis 3 mois sans aucune réaction, même avec ma peau sensible.',
//     image: '/images/avatar-chatbot/avatar3.jpg'
//   },
//   'entretien': {
//     name: 'Sarah K.',
//     story: 'Grâce aux conseils d&apos;entretien, mes créoles dorées brillent toujours comme au premier jour après 6 mois d&apos;utilisation quotidienne.',
//     image: '/images/avatar-chatbot/avatar4.jpg'
//   },
//   'retours': {
//     name: 'Marine B.',
//     story: 'J&apos;ai dû échanger une paire trop grande. Le processus était ultra simple et la nouvelle paire m&apos;est parvenue en 48h seulement !',
//     image: '/images/avatar-chatbot/avatar5.jpg'
//   },
//   'commande': {
//     name: 'Emma T.',
//     story: 'J&apos;hésitais entre deux modèles, le service client m&apos;a envoyé des photos supplémentaires pour m&apos;aider à choisir. Quelle attention !',
//     image: '/images/avatar-chatbot/avatar1.jpg'
//   }
// };

// Citations inspirantes pour le storytelling
const inspiringQuotes = [
  "Nos créatrices sélectionnent chaque pierre avec passion pour vous offrir des pièces uniques.",
  "Chaque paire de boucles raconte une histoire qui sublimera la vôtre.",
  "L&apos;élégance se trouve dans les détails – comme le fermoir sécurisé de nos créations.",
  "Nos boucles d&apos;oreilles sont conçues pour accompagner tous vos moments, des plus ordinaires aux plus précieux."
];

// Composant pour un item de FAQ avec storytelling amélioré
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; category: string; }> = ({ 
  question, 
  answer, 
  isOpen, 
  onClick,
  category
}) => {
  // Enrichissement de la réponse selon la catégorie
  const getEnhancedAnswer = () => {
    const enhancedAnswer = answer;
    const randomQuote = inspiringQuotes[Math.floor(Math.random() * inspiringQuotes.length)];
    
    if (category === 'produits') {
      return (
        <>
          <p className="text-gray-700 mb-3">{enhancedAnswer}</p>
          <div className="flex items-start mt-4">
            <HiSparkles className="text-dore w-5 h-5 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600 italic">{randomQuote}</p>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            <strong>Conseil styling :</strong> Nos boucles d&apos;oreilles en acier inoxydable se marient parfaitement avec des tenues casual chic et apportent une touche d&apos;élégance à vos looks quotidiens.
          </p>
        </>
      );
    } else if (category === 'entretien') {
      return (
        <>
          <p className="text-gray-700 mb-3">{enhancedAnswer}</p>
          <div className="bg-gray-50 p-3 rounded-md mt-3">
            <div className="flex items-start">
              <HiLightBulb className="text-menthe w-5 h-5 mt-0 mr-2 flex-shrink-0" />
              <p className="text-sm">Astuce pro : Utilisez un chiffon en microfibre et évitez les produits chimiques agressifs qui pourraient ternir l&apos;éclat des métaux.</p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <p className="text-gray-700 mb-3">{enhancedAnswer}</p>
          <div className="flex items-start mt-3">
            <HiThumbUp className="text-lilas-fonce w-5 h-5 mt-0 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600">Plus de 94% de nos client·e·s sont satisfait·e·s de notre réponse à cette question !</p>
          </div>
        </>
      );
    }
  };
  
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-4 px-6 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none transition-colors"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span className={`ml-6 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <HiChevronDown className="h-5 w-5 text-lilas-fonce" />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50">
              {getEnhancedAnswer()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant pour afficher un témoignage client
// const ClientStory: React.FC<{ category: string }> = ({ category }) => {
//   const story = clientStories[category as keyof typeof clientStories];
  
//   if (!story) return null;
  
//   return (
//     <div className="bg-white rounded-lg p-4 shadow-sm mb-6 flex items-start">
//       <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
//         {story.image && (
//           <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
//         )}
//       </div>
//       <div>
//         <p className="text-sm text-gray-600 italic mb-1">&quot;{story.story}&quot;</p>
//         <p className="text-xs font-medium text-gray-800">{story.name}</p>
//       </div>
//     </div>
//   );
// };

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  
  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };
  
  // Filtrer les FAQs en fonction de la catégorie sélectionnée et de la recherche
  const filteredFaqs = faqsData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch && faq.isActive;
  });
  
  // Grouper les FAQs par catégorie pour l'affichage en sections
  const faqsByCategory = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqsData>);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-4">
          Découvrez les Secrets de vos Boucles d&apos;Oreilles 💫
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Matériaux éthiques, conseils d&apos;entretien, astuces de style... Toutes les réponses pour sublimer votre expérience avec vos bijoux GlowLoops au quotidien !
        </p>
        <div className="flex justify-center items-center mt-4">
          <div className="text-sm bg-menthe text-black px-4 py-2 rounded-lg shadow-md font-medium">
            <strong>98% des client·e·s</strong> trouvent leur réponse en moins d&apos;une minute
          </div>
        </div>
      </div>
      
      {/* Barre de recherche et filtres */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto mb-6">
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Comment puis-je vous aider avec vos boucles d'oreilles aujourd'hui ?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-lilas-clair focus:border-lilas-clair"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === category.id 
                  ? 'bg-lilas-fonce text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Liste de FAQs */}
      <div className="space-y-8">
        {/* {activeCategory !== 'all' && <ClientStory category={activeCategory} />} */}
       
        
        {activeCategory === 'all' ? (
          // Affichage par catégories
          Object.entries(faqsByCategory).map(([category, faqs]) => {
            // Trouver le libellé de la catégorie
            const categoryLabel = categories.find(c => c.id === category)?.label || category;
            
            return (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">{categoryLabel}</h2>
                {/* <ClientStory category={category} /> */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {faqs.map((faq) => (
                    <FAQItem 
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      category={faq.category}
                      isOpen={openItemId === faq.id}
                      onClick={() => toggleItem(faq.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Affichage simple pour une catégorie
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <FAQItem 
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  category={faq.category}
                  isOpen={openItemId === faq.id}
                  onClick={() => toggleItem(faq.id)}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">Aucune réponse ne correspond à votre recherche. Essayez avec d&apos;autres termes ou contactez-nous directement !</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Section statistiques */}
      <div className="mt-12 bg-lilas-clair/10 rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-5 text-center text-lilas-fonce">GlowLoops en quelques chiffres ✨</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-lilas-fonce mb-1">97%</p>
            <p className="text-gray-600">de client·e·s satisfait·e·s</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-lilas-fonce mb-1">+15K</p>
            <p className="text-gray-600">bijoux livrés chaque mois</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-lilas-fonce mb-1">100%</p>
            <p className="text-gray-600">matériaux hypoallergéniques</p>
          </div>
        </div>
      </div>
      
      {/* Section contact */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Vous n&apos;avez pas trouvé votre réponse ? Notre équipe de stylistes bijoux est là pour vous conseiller personnellement !
        </p>
        <Link href="/contact">
          <button className="px-6 py-3 bg-lilas-fonce text-white rounded-md hover:bg-lilas-clair transition-colors">
            Obtenez votre conseil personnalisé
          </button>
        </Link>
      </div>
    </div>
  );
} 