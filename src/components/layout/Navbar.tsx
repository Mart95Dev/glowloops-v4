"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { useCartStore } from '@/lib/store/cart-store';
import { useFavoritesCount } from '@/lib/store/favoritesStore';
import { toast } from '@/lib/utils/toast';
import { authService } from '@/lib/firebase/auth-service';
import { navigationData } from '@/lib/data/navigation-data';
import SearchBar from '@/components/layout/SearchBar';

// Import des micro-composants
import {
  Logo,
  MenuButton,
  FavoritesButton,
  CartButton,
  UserMenu,
  NavDesktop
} from '@/components/ui/navbar';

interface NavbarProps {
  onMobileMenuToggle: (isOpen: boolean) => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems);
  const { user } = useAuth();
  const { count: favoritesCount } = useFavoritesCount();
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Monter le composant côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effet pour détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus au changement de page
  useEffect(() => {
    if (!isMounted) return;
    
    setIsMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname, isMounted]);

  // Fermer le menu utilisateur lorsqu'on clique en dehors
  useEffect(() => {
    if (!isMounted) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMounted]);

  const toggleMobileMenu = () => {
    if (!isMounted) return;
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle(newState);
  };

  const toggleUserMenu = () => {
    if (!isMounted) return;
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = async () => {
    if (!isMounted) return;
    
    try {
      await authService.signOut();
      
      setUserMenuOpen(false);
      
      toast.success("Vous êtes déconnecté", {
        description: "À bientôt sur GlowLoops!"
      });
      
      router.push('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // Si pas encore monté côté client, ne rien afficher pour éviter les erreurs d'hydratation
  if (!isMounted) {
    return null;
  }

  return (
    <div className={`relative bg-white ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20 py-2">
          {/* Logo */}
          <Logo />

          {/* Barre de recherche */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">

            {/* Compte */}
            <UserMenu 
              isOpen={userMenuOpen}
              toggleMenu={toggleUserMenu}
              menuRef={userMenuRef}
              user={user}
              onLogout={handleLogout}
            />

            {/* Favoris */}
            <FavoritesButton count={favoritesCount} />

            {/* Panier */}
            <CartButton itemCount={totalItems} />

            {/* Bouton menu mobile */}
            <MenuButton 
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* Navbar desktop */}
      <NavDesktop 
        navigationData={navigationData}
        pathname={pathname}
      />
    </div>
  );
}
