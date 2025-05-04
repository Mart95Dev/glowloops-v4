import { Search as SearchIcon } from 'lucide-react';
import { FormEvent } from 'react';

interface SearchDesktopProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: FormEvent) => void;
}

export const SearchDesktop = ({ searchQuery, setSearchQuery, onSearch }: SearchDesktopProps) => {
  return (
    <div className="hidden md:block flex-1 max-w-md mx-4 border rounded-full border-gray-300">
      <div className="relative">
        <form onSubmit={onSearch}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm border border-transparent rounded-full focus:outline-none focus:border-lilas-fonce focus:ring-1 focus:ring-lilas-fonce"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-4 h-4 text-gray-500" />
          </div>
          <button 
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 sr-only"
          >
            Rechercher
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchDesktop;
