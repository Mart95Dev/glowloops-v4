"use client";

export default function ProductPageSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 animate-pulse">
      {/* Fil d'Ariane */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      
      {/* Section principale du produit */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Galerie d'images */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Informations produit */}
        <div className="w-full lg:w-1/2">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
        </div>
      </div>

      {/* Onglets d'information produit */}
      <div className="mb-12">
        <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-40 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Sections supplémentaires */}
      {[...Array(4)].map((_, index) => (
        <div key={index} className="mb-12">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
