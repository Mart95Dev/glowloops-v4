import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Category } from '@/lib/data/navigation-data';

interface NavDesktopProps {
  navigationData: Category[];
  pathname: string;
}

export const NavDesktop = ({ navigationData, pathname }: NavDesktopProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className="hidden md:block border-t border-gray-200 bg-lilas-fonce text-white">
      <div className="container mx-auto px-4 max-w-7xl">
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

                {category.subcategories && activeMenu === category.name && (
                  <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden z-20">
                    <div className="py-2">
                      {category.subcategories.map((subcategory) => (
                        <Link 
                          key={subcategory.href}
                          href={subcategory.href} 
                          className={`block px-4 py-2 text-sm text-gray-800 hover:bg-lilas-clair hover:text-lilas-fonce transition-colors ${
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
        </div>
      </div>
    </div>
  );
};

export default NavDesktop;
