"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUIStore } from '@/lib/store/ui-store';
import { useCartStore } from '@/lib/store/cart-store';
import { useUserStore } from '@/lib/store/user-store';
import { Button } from '../ui/Button';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const { isMenuOpen, toggleMenu, toggleCart } = useUIStore();
  const { totalItems } = useCartStore();
  const { user } = useUserStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // Effet pour détecter le défilement
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      {/* Bannière promotionnelle */}
      <div className="bg-lilas-fonce text-white py-2 text-center text-sm">
        <p>
          <span className="font-medium">Livraison offerte</span> dès 50€ d&apos;achat | Code: GLOWSUMMER
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="GlowLoops" 
                width={150} 
                height={40} 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation principale - masquée sur mobile */}
          <nav className="hidden md:flex space-x-8">
            <NavLink href="/collections/nouveautes">Nouveautés</NavLink>
            <NavLink href="/collections/bijoux" hasDropdown>Bijoux</NavLink>
            <NavLink href="/collections/accessoires" hasDropdown>Accessoires</NavLink>
            <NavLink href="/collections/best-sellers">Best-sellers</NavLink>
            <NavLink href="/a-propos">À propos</NavLink>
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <SearchBar />

            {/* Compte utilisateur */}
            <div className="hidden sm:block">
              <Link href={user ? "/mon-compte" : "/connexion"}>
                <Button variant="ghost" size="icon" aria-label="Mon compte">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Button>
              </Link>
            </div>

            {/* Panier */}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Panier"
              onClick={toggleCart}
              className="relative"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-lilas-fonce text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Menu burger pour mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="md:hidden"
              onClick={toggleMenu}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </>
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <MobileMenu isOpen={isMenuOpen} />
    </header>
  );
};

// Composant de lien de navigation avec support pour les sous-menus
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, hasDropdown }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => hasDropdown && setIsDropdownOpen(true)}
      onMouseLeave={() => hasDropdown && setIsDropdownOpen(false)}
    >
      <Link 
        href={href} 
        className="text-foreground hover:text-lilas-fonce transition-colors py-2 inline-flex items-center"
      >
        {children}
        {hasDropdown && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="ml-1 h-4 w-4"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        )}
      </Link>

      {/* Sous-menu */}
      {hasDropdown && isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20 transition-opacity duration-300">
          <div className="py-2">
            {href === '/collections/bijoux' ? (
              <>
                <DropdownLink href="/collections/bijoux/boucles-oreilles">Boucles d&apos;oreilles</DropdownLink>
                <DropdownLink href="/collections/bijoux/colliers">Colliers</DropdownLink>
                <DropdownLink href="/collections/bijoux/bracelets">Bracelets</DropdownLink>
                <DropdownLink href="/collections/bijoux/bagues">Bagues</DropdownLink>
                <DropdownLink href="/collections/bijoux/ensembles">Ensembles</DropdownLink>
              </>
            ) : href === '/collections/accessoires' ? (
              <>
                <DropdownLink href="/collections/accessoires/barrettes">Barrettes</DropdownLink>
                <DropdownLink href="/collections/accessoires/headbands">Headbands</DropdownLink>
                <DropdownLink href="/collections/accessoires/porte-cles">Porte-clés</DropdownLink>
                <DropdownLink href="/collections/accessoires/autres">Autres</DropdownLink>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant de lien pour le menu déroulant
interface DropdownLinkProps {
  href: string;
  children: React.ReactNode;
}

const DropdownLink: React.FC<DropdownLinkProps> = ({ href, children }) => {
  return (
    <Link 
      href={href} 
      className="block px-4 py-2 text-sm text-foreground hover:bg-lilas-clair hover:text-lilas-fonce transition-colors"
    >
      {children}
    </Link>
  );
};

export default Header;
