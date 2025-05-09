import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navigationData } from '../../lib/data/navigation-data';

const MainNavigation: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
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
            className={`text-gray-800 hover:text-lilas-fonce transition-colors ${category.subcategories ? 'inline-flex items-center' : ''} ${
              pathname === category.href || pathname.startsWith(`${category.href}/`) ? 'text-lilas-fonce font-medium' : ''
            }`}
          >
            {category.name}
            {category.subcategories && <ChevronDown size={16} className="ml-1" />}
          </Link>

          {category.subcategories && activeMenu === category.name && (
            <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden z-20">
              <div className="py-2">
                {category.subcategories.map((subcategory) => (
                  <Link 
                    key={subcategory.href}
                    href={subcategory.href} 
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-lilas-clair hover:text-lilas-fonce transition-colors ${
                      subcategory.featured ? 'font-medium' : ''
                    }`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default MainNavigation;
