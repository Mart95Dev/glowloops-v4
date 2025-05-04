"use client";

import React, { useState, useEffect } from 'react';
import {
  ShopSection,
  HelpSection,
  AboutSection,
  FooterLogo,
  FooterBottom,
  ScrollTopButton
} from '../ui/footer';

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
  const slogan = 'Des boucles d\'oreilles qui font tourner les tetes. Style unique, petits prix, grands effets.';

  return (
    <footer className="bg-white border-t relative print:hidden" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      {/* Bouton scroll to top */}
      <ScrollTopButton show={showScrollTop} onClick={scrollToTop} />

      {/* Main footer */}
      <div className="container mx-auto py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et informations */}
          <FooterLogo slogan={slogan} />

          {/* Sections du footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:col-span-3">
            <ShopSection />
            <HelpSection />
            <AboutSection />
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
