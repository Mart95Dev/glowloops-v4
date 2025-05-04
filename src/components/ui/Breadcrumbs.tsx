import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, separator = '/', ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex", className)}
        aria-label="Fil d'Ariane"
        {...props}
      >
        <ol className="flex flex-wrap items-center space-x-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {item.href && !item.isCurrent ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-lilas-fonce transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "text-sm",
                      item.isCurrent ? "font-medium text-lilas-fonce" : "text-gray-500"
                    )}
                    aria-current={item.isCurrent ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                
                {!isLast && (
                  <span className="mx-2 text-gray-400">
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export { Breadcrumbs };
