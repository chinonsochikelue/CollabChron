// components/SkeletonLoader.js
const SkeletonLoader = () => {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div> {/* Title Skeleton */}
        <div className="h-4 bg-gray-300 rounded w-2/3"></div> {/* Subtitle Skeleton */}
        <div className="h-64 bg-gray-200 rounded w-full"></div> {/* Image Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
        </div> {/* Text Content Skeleton */}
      </div>
    );
  };
  
  export default SkeletonLoader;
  