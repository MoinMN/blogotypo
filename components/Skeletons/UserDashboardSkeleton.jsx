import SkeletonBox from './Skeleton';

const UserDashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Hero content */}
      <div className="grid md:grid-cols-7 gap-3">
        {/* Slider for trending blogs */}
        <div className="md:col-span-5">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' height={400} />
        </div>

        {/* Top-rated blogs */}
        <div className="hidden md:col-span-2 md:flex flex-col gap-4">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' height={150} count={3} />
        </div>
      </div>

      {/* Trending */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="my-1">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' height={30} width={200} />
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' height={200} />
        </div>
      ))}

    </div>
  );
}

export default UserDashboardSkeleton;
