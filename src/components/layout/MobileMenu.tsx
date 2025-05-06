"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, User, LogOut, ShoppingBag, Heart, Settings } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth';
import { authService } from '@/lib/firebase/auth-service';
import { navigationData } from '../../lib/data/navigation-data';
import { toast } from '@/lib/utils/toast';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

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
      // Réinitialiser les états lors de la fermeture du menu
      setActiveCategory(null);
      setShowUserMenu(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMounted]);
  
  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await authService.signOut();
      
      onClose();
      
      toast.success("Vous êtes déconnecté", {
        description: "À bientôt sur GlowLoops!"
      });
      
      router.push('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };
  
  // Fonction pour ouvrir une catégorie
  const openCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
  };
  
  // Fonction pour revenir au menu principal
  const goBack = () => {
    setActiveCategory(null);
    setShowUserMenu(false);
  };
  
  // Fonction pour naviguer et fermer le menu
  const navigateTo = (href: string) => {
    router.push(href);
    onClose();
  };

  // Si pas encore monté côté client, ne rien afficher
  if (!isMounted) {
    return null;
  }
  
  // Variants pour les animations Framer Motion
  const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        type: 'tween',
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };
  
  const slideInVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        type: 'tween',
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    })
  };

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
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-lilas-fonce text-white shadow-xl z-50 md:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* En-tête du menu */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-medium text-white">
                  {activeCategory ? 
                    <button 
                      onClick={goBack}
                      className="flex items-center text-white/90 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={20} className="mr-1" />
                      Retour
                    </button> : 
                    (showUserMenu ? 
                      <button 
                        onClick={goBack}
                        className="flex items-center text-white/90 hover:text-white transition-colors"
                      >
                        <ChevronLeft size={20} className="mr-1" />
                        Retour
                      </button> : 
                      "Menu"
                    )
                  }
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Contenu du menu */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* Menu principal */}
                  {!activeCategory && !showUserMenu && (
                    <motion.div
                      key="main-menu"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={slideInVariants}
                      className="h-full"
                    >
                      <nav className="py-2">
                        {navigationData.map((category, index) => (
                          <motion.div 
                            key={category.name}
                            custom={index}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            className="border-b border-white/10 last:border-0"
                          >
                            {category.subcategories ? (
                              <button
                                onClick={() => openCategory(category.name)}
                                className="flex items-center justify-between w-full px-6 py-4 text-left text-lg text-white hover:bg-white/5 transition-colors"
                              >
                                <span>{category.name}</span>
                                <ChevronRight size={20} />
                              </button>
                            ) : (
                              <button
                                onClick={() => navigateTo(category.href)}
                                className="w-full px-6 py-4 text-left text-lg text-white hover:bg-white/5 transition-colors"
                              >
                                {category.name}
                              </button>
                            )}
                          </motion.div>
                        ))}
                        
                        {/* Bouton Mon Compte / Se connecter */}
                        <motion.div 
                          custom={navigationData.length}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="border-t border-white/10 mt-2"
                        >
                          {user ? (
                            <button
                              onClick={() => setShowUserMenu(true)}
                              className="flex items-center justify-between w-full px-6 py-4 text-left text-lg text-white hover:bg-white/5 transition-colors"
                            >
                              <span className="flex items-center">
                                <User size={20} className="mr-2" />
                                Mon compte
                              </span>
                              <ChevronRight size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => navigateTo('/connexion')}
                              className="flex items-center w-full px-6 py-4 text-left text-lg text-white hover:bg-white/5 transition-colors"
                            >
                              <User size={20} className="mr-2" />
                              Se connecter
                            </button>
                          )}
                        </motion.div>
                      </nav>
                    </motion.div>
                  )}
                  
                  {/* Sous-menu catégorie */}
                  {activeCategory && (
                    <motion.div
                      key={`submenu-${activeCategory}`}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={slideInVariants}
                      className="h-full"
                    >
                      <div className="py-2">
                        <h3 className="px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white/70">{activeCategory}</h3>
                        <nav>
                          {navigationData
                            .find(cat => cat.name === activeCategory)?.subcategories
                            ?.map((subcategory, index) => (
                              <motion.div 
                                key={subcategory.href}
                                custom={index}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                                className="border-b border-white/10 last:border-0"
                              >
                                <button
                                  onClick={() => navigateTo(subcategory.href)}
                                  className="w-full px-6 py-3 text-left text-white hover:bg-white/5 transition-colors flex items-center"
                                >
                                  {subcategory.featured && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-menthe mr-2"></span>
                                  )}
                                  {subcategory.name}
                                </button>
                              </motion.div>
                          ))}
                        </nav>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Menu utilisateur */}
                  {showUserMenu && user && (
                    <motion.div
                      key="user-menu"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={slideInVariants}
                      className="h-full"
                    >
                      <div className="py-2">
                        <div className="px-6 py-4 border-b border-white/10">
                          <p className="text-sm text-white/70">Connecté en tant que</p>
                          <p className="font-medium truncate">{user.email}</p>
                        </div>
                        <nav className="py-2">
                          {[
                            { icon: <User size={20} />, label: 'Mon profil', href: '/compte/profil' },
                            { icon: <ShoppingBag size={20} />, label: 'Mes commandes', href: '/compte/commandes' },
                            { icon: <Heart size={20} />, label: 'Mes favoris', href: '/compte/favoris' },
                            { icon: <Settings size={20} />, label: 'Paramètres', href: '/compte/parametres' },
                          ].map((item, index) => (
                            <motion.div 
                              key={item.href}
                              custom={index}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              className="border-b border-white/10 last:border-0"
                            >
                              <button
                                onClick={() => navigateTo(item.href)}
                                className="w-full px-6 py-3 text-left text-white hover:bg-white/5 transition-colors flex items-center"
                              >
                                <span className="mr-3 text-white/80">{item.icon}</span>
                                {item.label}
                              </button>
                            </motion.div>
                          ))}
                          
                          <motion.div 
                            custom={4}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            className="border-t border-white/10 mt-2 pt-2"
                          >
                            <button
                              onClick={handleLogout}
                              className="w-full px-6 py-3 text-left text-red-300 hover:bg-white/5 transition-colors flex items-center"
                            >
                              <LogOut size={20} className="mr-3" />
                              Déconnexion
                            </button>
                          </motion.div>
                        </nav>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
