import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Category } from '../../../lib/data/navigation-data';

interface NavDesktopProps {
  navigationData: Category[];
  pathname: string;
}

export const NavDesktop = ({ navigationData, pathname }: NavDesktopProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 200); // Délai pour éviter la fermeture trop rapide
    setHoverTimeout(timeout);
  };
  
  // Variants pour les animations Framer Motion
  const menuVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      height: 0,
      transition: { 
        duration: 0.15,
        ease: 'easeIn'
      }
    }
  };

  return (
    <div className="hidden lg:block border-t border-gray-200 bg-lilas-fonce text-white">
      <div className="container mx-auto px-4 max-w-7xl min-w-[375px]">
        <div className="flex items-center justify-center h-12">
          <nav className="flex space-x-6" aria-label="Navigation principale">
            {navigationData.map((category) => (
              <div 
                key={category.name}
                className="relative group"
                onMouseEnter={() => category.subcategories && handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  href={category.href} 
                  className={`font-medium text-white hover:text-creme-nude transition-colors ${category.subcategories ? 'inline-flex items-center' : ''} ${
                    pathname === category.href || pathname.startsWith(`${category.href}/`) ? 'text-creme-nude font-semibold' : ''
                  }`}
                >
                  {category.name}
                  {category.subcategories && <ChevronDown size={16} className="ml-1" />}
                </Link>

                <AnimatePresence>
                  {category.subcategories && activeMenu === category.name && (
                    <motion.div 
                      className="absolute left-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-20"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuVariants}
                      onMouseEnter={() => handleMouseEnter(category.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Style, Vibe, Matériaux */}
                      {category.name === 'Collections' || category.name === 'Boutique' ? (
                        <div className="grid grid-cols-3 gap-4 p-4 w-[600px]">
                          {/* Style */}
                          <div>
                            <h3 className="font-semibold text-lilas-fonce mb-2 text-sm uppercase tracking-wider">Style</h3>
                            <ul className="space-y-1">
                              {category.subcategories
                                .filter(sub => sub.type === 'style')
                                .map((subcategory) => (
                                  <li key={subcategory.href}>
                                    <Link 
                                      href={subcategory.href} 
                                      className={`block px-2 py-1 text-sm text-gray-700 hover:bg-lilas-clair hover:text-lilas-fonce rounded transition-colors ${
                                        subcategory.featured ? 'font-medium' : ''
                                      } ${pathname === subcategory.href ? 'bg-lilas-clair text-lilas-fonce' : ''}`}
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Vibe */}
                          <div>
                            <h3 className="font-semibold text-lilas-fonce mb-2 text-sm uppercase tracking-wider">Vibe</h3>
                            <ul className="space-y-1">
                              {category.subcategories
                                .filter(sub => sub.type === 'vibe')
                                .map((subcategory) => (
                                  <li key={subcategory.href}>
                                    <Link 
                                      href={subcategory.href} 
                                      className={`block px-2 py-1 text-sm text-gray-700 hover:bg-lilas-clair hover:text-lilas-fonce rounded transition-colors ${
                                        subcategory.featured ? 'font-medium' : ''
                                      } ${pathname === subcategory.href ? 'bg-lilas-clair text-lilas-fonce' : ''}`}
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Matériaux */}
                          <div>
                            <h3 className="font-semibold text-lilas-fonce mb-2 text-sm uppercase tracking-wider">Matériaux</h3>
                            <ul className="space-y-1">
                              {category.subcategories
                                .filter(sub => sub.type === 'material')
                                .map((subcategory) => (
                                  <li key={subcategory.href}>
                                    <Link 
                                      href={subcategory.href} 
                                      className={`block px-2 py-1 text-sm text-gray-700 hover:bg-lilas-clair hover:text-lilas-fonce rounded transition-colors ${
                                        subcategory.featured ? 'font-medium' : ''
                                      } ${pathname === subcategory.href ? 'bg-lilas-clair text-lilas-fonce' : ''}`}
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Image promotionnelle */}
                          <div className="col-span-3 mt-4 relative h-32 rounded-md overflow-hidden">
                            <Image 
                              src="/images/promo-nav.jpg" 
                              alt="Découvrez nos nouveautés" 
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-lilas-fonce/70 to-transparent flex items-center">
                              <div className="p-4 text-white">
                                <h4 className="text-lg font-bold">Nouveautés</h4>
                                <p className="text-sm">Découvrez nos dernières créations</p>
                                <Link 
                                  href="/nouveautes" 
                                  className="mt-2 inline-block text-xs bg-white text-lilas-fonce px-3 py-1 rounded-full hover:bg-lilas-clair transition-colors"
                                >
                                  Voir plus
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2 w-56">
                          {category.subcategories.map((subcategory) => (
                            <Link 
                              key={subcategory.href}
                              href={subcategory.href} 
                              className={`block px-4 py-2 text-sm text-gray-800 hover:bg-lilas-clair hover:text-lilas-fonce transition-colors ${
                                subcategory.featured ? 'font-medium' : ''
                              } ${pathname === subcategory.href ? 'bg-lilas-clair text-lilas-fonce' : ''}`}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavDesktop;
