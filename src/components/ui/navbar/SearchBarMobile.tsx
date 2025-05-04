import React from 'react';
import SearchBar from '@/components/layout/SearchBar';

/**
 * Composant SearchBarMobile
 * Affiche la SearchBar modale (Command) uniquement sur mobile (sm)
 * Respecte la cohérence design (voir old_components si besoin)
 */
const SearchBarMobile: React.FC = () => {
  return (
    <div className="block md:hidden w-full px-4 py-2">
      <SearchBar />
    </div>
  );
};

export default SearchBarMobile;
