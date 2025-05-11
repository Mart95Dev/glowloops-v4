import React from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageTitle({ title, description, className = '' }: PageTitleProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <h1 className="text-2xl font-playfair text-lilas-fonce md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
} 