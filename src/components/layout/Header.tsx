"use client";

import React, { useState, useEffect } from 'react';
import PromoBanner from './PromoBanner';
import MobileMenu from './MobileMenu';
import Navbar from './Navbar';
import promoService, { PromoInfo } from '@/lib/services/promo-service';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activePromo, setActivePromo] = useState<PromoInfo | null>(null);
  const [promoEndDate, setPromoEndDate] = useState<Date>(new Date());
  
  // Marquer comme monté côté client et charger les données de promotion
  useEffect(() => {
    setIsMounted(true);
    
    // Charger la promotion active
    const promo = promoService.getActivePromo();
    if (promo) {
      setActivePromo(promo);
      setPromoEndDate(promoService.calculateEndDate(promo.durationDays));
    }
  }, []);
  
  const toggleMobileMenu = (isOpen: boolean) => {
    if (!isMounted) return;
    setIsMobileMenuOpen(isOpen);
  };
  
  // Si pas encore monté côté client, ne rien afficher
  if (!isMounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm" role="banner">
      {/* Bannière promo */}
      {activePromo && (
        <PromoBanner 
          message={activePromo.message}
          endDate={promoEndDate}
          variant={activePromo.variant}
          link={activePromo.link}
        />
      )}
      
      {/* Navbar modulaire */}
      <Navbar onMobileMenuToggle={toggleMobileMenu} />

      {/* Menu mobile */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => toggleMobileMenu(false)} />
    </header>
  );
};

export default Header;
