export default function MateriauxPageSkeleton() {
  return (
    <div className="min-w-[375px] py-8 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header Skeleton */}
        <div className="relative w-full h-40 sm:h-60 md:h-80 rounded-lg overflow-hidden mb-6 bg-gray-200 animate-pulse" />

        {/* Featured Categories Skeleton */}
        <div className="py-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 sm:h-48 bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        </div>

        {/* Features Section Skeleton */}
        <div className="py-8">
          <div className="h-8 w-80 bg-gray-200 rounded-md mb-6 mx-auto animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-100">
                <div className="h-10 w-10 mx-auto bg-gray-200 rounded-full mb-4 animate-pulse" />
                <div className="h-6 w-32 mx-auto bg-gray-200 rounded-md mb-3 animate-pulse" />
                <div className="h-20 w-full bg-gray-200 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Products Section Skeleton */}
        <div className="py-8">
          <div className="h-8 w-64 bg-gray-200 rounded-md mb-6 animate-pulse" />
          <div className="flex justify-between items-center mb-6">
            <div className="h-5 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-md p-4 h-80 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-md mb-4" />
                <div className="h-5 w-40 bg-gray-200 rounded-md mb-2" />
                <div className="h-4 w-20 bg-gray-200 rounded-md mb-4" />
                <div className="h-8 w-full bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 