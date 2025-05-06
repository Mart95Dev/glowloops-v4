"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { useCartStore } from '@/lib/store/cart-store';
import { useFavoritesCount } from '@/lib/store/favoritesStore';
import { toast } from '@/lib/utils/toast';
import { authService } from '@/lib/firebase/auth-service';
import { navigationData } from '../../lib/data/navigation-data';
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
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle: (isOpen: boolean) => void;
}

export default function Navbar({ isMobileMenuOpen: propsMobileMenuOpen, onMobileMenuToggle }: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // Utiliser l'état fourni par le parent s'il existe, sinon utiliser un état local
  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false);
  
  // Déterminer l'état actuel du menu mobile
  const isMobileMenuOpen = propsMobileMenuOpen !== undefined ? propsMobileMenuOpen : localMobileMenuOpen;
  
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
    
    // Fermer les menus sans délai
    setLocalMobileMenuOpen(false);
    onMobileMenuToggle(false); // Synchroniser l'état avec le composant parent
    setUserMenuOpen(false);
  }, [pathname, isMounted, onMobileMenuToggle]);

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
    // Inverser l'état actuel
    const newState = !isMobileMenuOpen;
    // Mettre à jour l'état local d'abord
    setLocalMobileMenuOpen(newState);
    // Puis notifier le parent
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
    <div>
      {/* Header principal avec logo et icônes */}
      <div className={`py-3 px-4 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
        <div className="container mx-auto min-w-[375px] px-4 max-w-7xl">
          {/* Version mobile (< 700px) */}
          <div className="block min-[700px]:hidden">
            <div className="flex items-center justify-between py-2">
              {/* Logo */}
              <Logo />
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
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

                {/* Bouton menu mobile - affiché jusqu'à 1047px */}
                <MenuButton 
                  onClick={toggleMobileMenu} 
                  isOpen={isMobileMenuOpen} 
                  className="lg:hidden text-lilas-fonce hover:text-lilas-clair transition-colors" 
                />
              </div>
            </div>
          </div>
          
          {/* Version desktop (>= 700px) */}
          <div className="hidden min-[700px]:flex items-center justify-between h-20 py-2">
            {/* Logo */}
            <Logo />
            
            {/* Barre de recherche au milieu */}
            <div className="flex-1 max-w-md mx-4">
              <SearchBar />
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
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

              {/* Bouton menu mobile - affiché jusqu'à 1047px */}
              <MenuButton 
                onClick={toggleMobileMenu} 
                isOpen={isMobileMenuOpen} 
                className="lg:hidden text-lilas-fonce hover:text-lilas-clair transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Barre de recherche mobile en full width */}
      <div className="block min-[700px]:hidden w-full bg-lilas-fonce py-3 px-4">
        <SearchBar isMobile={true} />
      </div>

      {/* Navbar desktop */}
      <NavDesktop 
        navigationData={navigationData}
        pathname={pathname}
      />
    </div>
  );
}
