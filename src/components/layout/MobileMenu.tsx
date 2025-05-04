"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/lib/store/ui-store';
import { useUserStore } from '@/lib/store/user-store';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  const { closeMenu } = useUIStore();
  const { user } = useUserStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {/* Lien utilisateur mobile */}
              <Link 
                href={user ? "/mon-compte" : "/connexion"}
                className="flex items-center py-2 text-foreground"
                onClick={closeMenu}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mr-3"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user ? "Mon compte" : "Connexion / Inscription"}
              </Link>

              {/* Nouveautés */}
              <Link 
                href="/collections/nouveautes" 
                className="py-2 text-foreground"
                onClick={closeMenu}
              >
                Nouveautés
              </Link>

              {/* Bijoux avec sous-catégories */}
              <div>
                <button 
                  className="flex items-center justify-between w-full py-2 text-foreground"
                  onClick={() => toggleCategory('bijoux')}
                >
                  <span>Bijoux</span>
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
                    className={`transition-transform duration-300 ${expandedCategory === 'bijoux' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedCategory === 'bijoux' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 space-y-2 overflow-hidden"
                    >
                      <Link 
                        href="/collections/bijoux/boucles-oreilles" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Boucles d&apos;oreilles
                      </Link>
                      <Link 
                        href="/collections/bijoux/colliers" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Colliers
                      </Link>
                      <Link 
                        href="/collections/bijoux/bracelets" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Bracelets
                      </Link>
                      <Link 
                        href="/collections/bijoux/bagues" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Bagues
                      </Link>
                      <Link 
                        href="/collections/bijoux/ensembles" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Ensembles
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accessoires avec sous-catégories */}
              <div>
                <button 
                  className="flex items-center justify-between w-full py-2 text-foreground"
                  onClick={() => toggleCategory('accessoires')}
                >
                  <span>Accessoires</span>
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
                    className={`transition-transform duration-300 ${expandedCategory === 'accessoires' ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedCategory === 'accessoires' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 space-y-2 overflow-hidden"
                    >
                      <Link 
                        href="/collections/accessoires/barrettes" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Barrettes
                      </Link>
                      <Link 
                        href="/collections/accessoires/headbands" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Headbands
                      </Link>
                      <Link 
                        href="/collections/accessoires/porte-cles" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Porte-clés
                      </Link>
                      <Link 
                        href="/collections/accessoires/autres" 
                        className="block py-2 text-foreground"
                        onClick={closeMenu}
                      >
                        Autres
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Best-sellers */}
              <Link 
                href="/collections/best-sellers" 
                className="py-2 text-foreground"
                onClick={closeMenu}
              >
                Best-sellers
              </Link>

              {/* À propos */}
              <Link 
                href="/a-propos" 
                className="py-2 text-foreground"
                onClick={closeMenu}
              >
                À propos
              </Link>

              {/* Liens supplémentaires */}
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                <Link 
                  href="/contact" 
                  className="block py-2 text-sm text-gray-500"
                  onClick={closeMenu}
                >
                  Contact
                </Link>
                <Link 
                  href="/faq" 
                  className="block py-2 text-sm text-gray-500"
                  onClick={closeMenu}
                >
                  FAQ
                </Link>
                <Link 
                  href="/livraison" 
                  className="block py-2 text-sm text-gray-500"
                  onClick={closeMenu}
                >
                  Livraison & Retours
                </Link>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
