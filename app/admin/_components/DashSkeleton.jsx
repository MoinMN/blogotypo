import SkeletonBox from "@components/Skeletons/Skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col flex-wrap gap-2 md:gap-4">
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        <div className="">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="200px" height={30} />
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="100%" height={300} />
        </div>
        <div className="">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="200px" height={30} />
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="100%" height={300} />
        </div>
      </div>

      <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="100%" height={300} />
    </div>
  );
};

export default DashboardSkeleton;
