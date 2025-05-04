import { User, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RefObject } from 'react';

interface UserMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  menuRef: RefObject<HTMLDivElement>;
  user: { displayName?: string | null; email?: string | null } | null;
  onLogout: () => void;
}

export const UserMenu = ({ isOpen, toggleMenu, menuRef, user, onLogout }: UserMenuProps) => {
  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={toggleMenu} 
        className="text-gray-700 hover:text-lilas-fonce transition-colors p-2 rounded-full hover:bg-gray-100 flex items-center"
        aria-label="Compte"
        aria-expanded={isOpen}
      >
        <User size={20} />
        <ChevronDown size={16} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200"
          >
            {user ? (
              <div>
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link 
                    href="/mon-compte" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Mon compte
                  </Link>
                  <Link 
                    href="/mes-commandes" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Mes commandes
                  </Link>
                  <Link 
                    href="/favoris" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={toggleMenu}
                  >
                    Mes favoris
                  </Link>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-1">
                <Link 
                  href="/connexion" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Connexion
                </Link>
                <Link 
                  href="/inscription" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Inscription
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
