import { Search as SearchIcon } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className="md:hidden text-white hover:text-creme-nude transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label="Rechercher"
    >
      <SearchIcon size={20} className='text-lilas-fonce'/>
    </button>
  );
};

export default SearchButton;
