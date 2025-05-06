export default function ShopPageSkeleton() {
  return (
    <div className="min-w-[375px] py-8 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
          <div className="h-4 w-full max-w-md bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {/* Filters Skeleton - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="h-6 w-32 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-6">
                  <div className="h-5 w-24 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center mb-2">
                      <div className="h-4 w-4 bg-gray-200 rounded-sm mr-2 animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-8 w-full bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
