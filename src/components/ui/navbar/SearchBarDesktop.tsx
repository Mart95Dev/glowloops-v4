import React from 'react';
import SearchBar from '@/components/layout/SearchBar';

/**
 * Composant SearchBarDesktop
 * Affiche la SearchBar modale (Command) uniquement sur desktop (md+)
 * Respecte la cohérence design (voir old_components si besoin)
 */
const SearchBarDesktop: React.FC = () => {
  return (
    <div className="hidden md:block flex-1 max-w-md mx-4">
      <SearchBar />
    </div>
  );
};

export default SearchBarDesktop;
