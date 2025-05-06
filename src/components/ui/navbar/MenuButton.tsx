import { Menu, X } from 'lucide-react';

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const MenuButton = ({ isOpen, onClick, className = '' }: MenuButtonProps) => {
  // Créer une fonction de gestion de clic pour éviter les problèmes d'état
  const handleClick = () => {
    // Appeler la fonction onClick fournie par le parent
    onClick();
  };

  return (
    <button 
      onClick={handleClick}
      className={`lg:hidden text-lilas-fonce hover:text-lilas-clair transition-colors p-2 rounded-full hover:bg-lilas-clair/20 min-h-[44px] min-w-[44px] flex items-center justify-center border border-lilas-clair ${className}`}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default MenuButton;
