import { ReactNode } from 'react';
import Link from 'next/link';

interface DashboardWidgetProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  footer?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function DashboardWidget({
  title,
  icon,
  children,
  footer,
  className = '',
}: DashboardWidgetProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-100">
        <div className="text-lilas-fonce">{icon}</div>
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <Link 
            href={footer.href}
            className="text-sm font-medium text-lilas-fonce hover:text-lilas-clair flex items-center"
          >
            {footer.label}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
} 