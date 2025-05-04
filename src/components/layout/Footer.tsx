"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Effet de parallax pour les sections du footer
  const translateY = useTransform(scrollYProgress, [0.7, 1], [50, 0]);
  
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

  // Valeurs par défaut pour les informations de l'entreprise
  const nom = 'GlowLoops';
  const email = 'contact@glowloops.com';
  const telephone = '+33 1 23 45 67 89';
  const site = 'www.glowloops.com';
  const adresse = '123 Rue de la Mode';
  const codePostal = '75001';
  const ville = 'Paris';
  const pays = 'France';
  const slogan = 'Des boucles d\'oreilles qui font tourner les têtes. Style unique, petits prix, grands effets.';

  return (
    <footer className="bg-gray-50 border-t relative print:hidden" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      {/* Bouton scroll to top */}
      <AnimatedScrollTopButton show={showScrollTop} onClick={scrollToTop} />

      {/* Main footer */}
      <div className="container mx-auto py-8 md:py-12 px-4 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="col-span-2 md:col-span-1"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <Link href="/" className="text-xl font-bold text-lilas-fonce mb-4 inline-block font-display" aria-label={`${nom} - Accueil`} itemProp="url">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lilas"
                itemProp="name"
              >
                {nom.substring(0, 4)}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                itemProp="name"
              >
                {nom.substring(4)}
              </motion.span>
            </Link>
            <p className="text-sm text-gray-600 mb-4" itemProp="description">
              {slogan}
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="block" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="streetAddress">{adresse}</span>,&nbsp;
                  <span itemProp="postalCode">{codePostal}</span>&nbsp;
                  <span itemProp="addressLocality">{ville}</span>,&nbsp;
                  <span itemProp="addressCountry">{pays}</span>
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <a href={`tel:${telephone}`} className="hover:text-lilas-fonce transition-colors" itemProp="telephone">
                  {telephone}
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <a href={`mailto:${email}`} className="hover:text-lilas-fonce transition-colors" itemProp="email">
                  {email}
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <a href={`https://${site}`} target="_blank" rel="noopener noreferrer" className="hover:text-lilas-fonce transition-colors" itemProp="url">
                  {site}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Shop column */}
          <motion.div
            style={{ y: translateY }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <h4 className="font-medium mb-4 text-gray-800" id="footer-nav-shop">Shop</h4>
            <ul className="space-y-2 text-sm" aria-labelledby="footer-nav-shop">
              {[
                { href: "/nouveautes", label: "Nouveautés" },
                { href: "/shop", label: "Boutique" },
                { href: "/packs", label: "Packs" },
                { href: "/abonnement", label: "Abonnement" }
              ].map((item, index) => (
                <motion.li 
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                    <Link href={item.href} className="text-gray-600 hover:text-lilas-fonce transition-colors" itemProp="url">
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Help column */}
          <motion.div
            style={{ y: translateY }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <h4 className="font-medium mb-4 text-gray-800" id="footer-nav-aide">Aide</h4>
            <ul className="space-y-2 text-sm" aria-labelledby="footer-nav-aide">
              {[
                { href: "/faq", label: "FAQ" },
                { href: "/livraison", label: "Livraison & Retours" },
                { href: "/contact", label: "Contact" },
                { href: "/taille-guide", label: "Guide des tailles" },
                { href: "/entretien", label: "Entretien des bijoux" }
              ].map((item, index) => (
                <motion.li 
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                    <Link href={item.href} className="text-gray-600 hover:text-lilas-fonce transition-colors" itemProp="url">
                      <span itemProp="name">{item.label}</span>
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Info column */}
          <motion.div
            style={{ y: translateY }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <h4 className="font-medium mb-4 text-gray-800" id="footer-nav-info">À propos</h4>
            <div className="space-y-3 text-sm">
              <h3 className="text-gray-500 font-medium mb-2">Informations</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/a-propos" className="text-gray-500 hover:text-lilas-700 transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/livraison" className="text-gray-500 hover:text-lilas-700 transition-colors">
                    Livraison
                  </Link>
                </li>
                <li>
                  <Link href="/cgv" className="text-gray-500 hover:text-lilas-700 transition-colors">
                    CGV
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="text-gray-500 hover:text-lilas-700 transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {}}
                    className="text-gray-500 hover:text-lilas-700 transition-colors"
                  >
                    Paramètres des cookies
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom footer */}
      <motion.div 
        className="border-t border-gray-200 py-4 md:py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 md:mb-0 text-center md:text-left">
            <span itemProp="copyrightYear">{new Date().getFullYear()}</span> © <span itemProp="copyrightHolder" itemScope itemType="https://schema.org/Organization"><span itemProp="name">{nom}</span></span>. Tous droits réservés.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center justify-center mb-4 md:mb-0">
              <Image 
                src="/images/payment/payment.png" 
                alt="Méthodes de paiement acceptées : Visa, Mastercard, PayPal"
                width={200}
                height={40}
                className="h-6 md:h-8 w-auto" 
              />
            </div>
            <div className="flex gap-4 text-xs md:text-sm" itemScope itemType="https://schema.org/SiteNavigationElement">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/accessibilite" className="text-gray-500 hover:text-lilas-fonce transition-colors" itemProp="url">
                  <span itemProp="name">Accessibilité</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link href="/contact" className="text-gray-500 hover:text-lilas-fonce transition-colors" itemProp="url">
                  <span itemProp="name">Nous contacter</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

// Composant pour le bouton de retour en haut
function AnimatedScrollTopButton({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <motion.button
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 p-3 bg-lilas rounded-full border-lilas-fonce border-2 shadow-lg z-50"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: show ? 1 : 0, 
        scale: show ? 1 : 0.5,
        y: show ? 0 : 20
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
      aria-label="Retour en haut de la page"
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </motion.button>
  );
}

export default Footer;
