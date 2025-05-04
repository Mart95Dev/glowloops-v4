import { FormEvent, RefObject } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchMobileProps {
  isVisible: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: FormEvent) => void;
  searchInputRef: RefObject<HTMLInputElement>;
}

export const SearchMobile = ({ 
  isVisible, 
  searchQuery, 
  setSearchQuery, 
  onSearch,
  searchInputRef 
}: SearchMobileProps) => {
  if (!isVisible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-gray-200 py-3 px-4 bg-white"
    >
      <form onSubmit={onSearch} className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:border-lilas-fonce focus:ring-1 focus:ring-lilas-fonce"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="w-4 h-4 text-gray-500" />
        </div>
        <button 
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
        >
          Rechercher
        </button>
      </form>
    </motion.div>
  );
};

export default SearchMobile;
