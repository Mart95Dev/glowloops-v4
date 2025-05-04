import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, currentPage, totalPages, onPageChange, siblingCount = 1, ...props }, ref) => {
    // Fonction pour générer la plage de pages à afficher
    const generatePaginationItems = () => {
      const items: (number | string)[] = [];
      
      // Toujours afficher la première page
      items.push(1);
      
      // Calculer la plage de pages à afficher autour de la page actuelle
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);
      
      // Ajouter des ellipses si nécessaire
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      if (shouldShowLeftDots) {
        items.push('...');
      }
      
      // Ajouter les pages dans la plage calculée
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        items.push(i);
      }
      
      if (shouldShowRightDots) {
        items.push('...');
      }
      
      // Toujours afficher la dernière page si elle existe
      if (totalPages > 1) {
        items.push(totalPages);
      }
      
      return items;
    };
    
    const paginationItems = generatePaginationItems();
    
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center space-x-1", className)}
        {...props}
      >
        <button
          className={cn(
            "inline-flex items-center justify-center h-8 w-8 rounded-md text-sm border border-gray-200",
            "hover:bg-lilas-clair hover:text-lilas-fonce transition-colors",
            currentPage === 1 && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Page précédente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {paginationItems.map((item, index) => {
          const isCurrentPage = item === currentPage;
          const isEllipsis = item === '...';
          
          if (isEllipsis) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center justify-center h-8 w-8 text-sm text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={`page-${item}`}
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-md text-sm",
                isCurrentPage
                  ? "bg-lilas-fonce text-white"
                  : "border border-gray-200 hover:bg-lilas-clair hover:text-lilas-fonce transition-colors"
              )}
              onClick={() => !isCurrentPage && onPageChange(item as number)}
              disabled={isCurrentPage}
              aria-current={isCurrentPage ? "page" : undefined}
              aria-label={`Page ${item}`}
            >
              {item}
            </button>
          );
        })}
        
        <button
          className={cn(
            "inline-flex items-center justify-center h-8 w-8 rounded-md text-sm border border-gray-200",
            "hover:bg-lilas-clair hover:text-lilas-fonce transition-colors",
            currentPage === totalPages && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Page suivante"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
