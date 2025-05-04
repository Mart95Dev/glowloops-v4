"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Marquer comme monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Désactiver le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (!isMounted) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMounted]);

  // Si pas encore monté côté client, ne rien afficher
  if (!isMounted) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay de fond */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* Menu mobile */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-lilas-fonce text-white shadow-xl z-50 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* En-tête du menu */}
              <div className="flex items-center justify-between p-4 border-b border-lilas/20">
                <h2 className="text-lg font-medium text-white">Menu</h2>
                <button 
                  onClick={onClose}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Contenu du menu */}
              <div className="flex-1 overflow-y-auto py-4 px-6">
                <nav className="flex-grow">
                  {[
                    { label: 'Nouveautés', href: '/nouveautes' },
                    { label: 'Style', href: '/style' },
                    { label: 'Vibe', href: '/vibe' },
                    { label: 'Matériaux', href: '/materiaux' },
                    { label: 'Packs', href: '/packs' },
                    { label: 'Abonnement', href: '/abonnement' },
                    { label: 'Boutique', href: '/shop' },
                    { label: user ? 'Mon compte' : 'Se connecter', href: user ? '/compte' : '/connexion' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="block py-4 text-lg transition-colors border-b border-lilas/20 last:border-0 text-white hover:text-[#f3f3fd]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                
                {user && (
                  <div className="mt-auto pb-6">
                    <button
                      onClick={() => {
                        // Appeler la fonction de déconnexion
                        onClose();
                      }}
                      className="block w-full text-left py-3 text-red-300 hover:text-red-200 transition-colors border-t border-lilas/20"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
