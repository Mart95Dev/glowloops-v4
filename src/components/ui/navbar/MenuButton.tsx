import { Menu, X } from 'lucide-react';

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MenuButton = ({ isOpen, onClick }: MenuButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="md:hidden text-white hover:text-creme-nude transition-colors p-2 rounded-full hover:bg-lilas-clair min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
};

export default MenuButton;
