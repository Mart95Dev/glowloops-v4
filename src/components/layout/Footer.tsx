"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiChevronUp } from 'react-icons/hi';
import { FooterBottom } from '../ui/footer';

const Footer: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Si pas encore monté côté client, ne rien afficher
  if (!isMounted) {
    return null;
  }

  // Valeur par defaut pour le slogan de l'entreprise
  const slogan = 'Des boucles d\'oreilles qui font tourner les têtes. Style unique, petits prix, grands effets.';

  return (
    <footer className="bg-white border-t border-gray-200 relative print:hidden" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      {/* Bouton scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-8 z-40 bg-lilas-fonce text-white p-3 rounded-full shadow-lg hover:bg-lilas-clair transition-colors"
          aria-label="Remonter en haut"
        >
          <HiChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Main footer */}
      <div className="container mx-auto py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et informations */}
          <div className="md:col-span-1">
            <Link href="/" className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold text-gray-800">Glow<span className="text-lilas-fonce">Loops</span></span>
            </Link>
            <p className="mt-4 text-gray-600 text-sm text-center md:text-left">
              {slogan.replace(/'/g, '\'')}
            </p>
            
            <div className="mt-6 flex justify-center md:justify-start space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-6 h-6 text-gray-600 hover:text-lilas-fonce transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg className="w-6 h-6 text-gray-600 hover:text-lilas-fonce transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Sections du footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:col-span-3">
            {/* Shop Section */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">Boutique</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/nouveautes" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Nouveautés
                  </Link>
                </li>
                {/* <li>
                  <Link href="/paris" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Paris
                  </Link>
                </li> */}
                <li>
                  <Link href="/promotions" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Promotions
                  </Link>
                </li>
                <li>
                  <Link href="/carte-cadeau" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Carte cadeau
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Help Section */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">Aide</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/livraison-retours" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Livraison & Retours
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Contact
                  </Link>
                </li>
                {/* <li>
                  <Link href="/guide-des-tailles" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Guide des tailles
                  </Link>
                </li> */}
                <li>
                  <Link href="/entretien-des-bijoux" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Entretien des bijoux
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* About Section */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">À propos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/a-propos" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Notre histoire
                  </Link>
                </li>
                {/* Lien désactivé temporairement
                <li>
                  <Link href="/avis-clients" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Avis clients
                  </Link>
                </li>
                */}
                <li>
                  <Link href="/cgv" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/politique-de-confidentialite" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/mentions-legales" className="text-gray-600 hover:text-lilas-fonce transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      // Suppression des cookies de consentement pour forcer l'affichage de la bannière
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('glowloops_cookie_consent');
                        localStorage.removeItem('glowloops_cookie_consent_options');
                        // Rafraîchissement de la page
                        window.location.reload();
                      }
                    }}
                    className="text-gray-600 hover:text-lilas-fonce transition-colors"
                  >
                    Paramètres des cookies
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
