import SkeletonBox from "@components/Skeletons/Skeleton";

export const BlogBoxSkeleton = () => {
  return (
    <div className="bg-slate-100 md:py-4 max-md:py-2 md:px-6 max-md:px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
      <div className="flex flex-col sm:grid sm:grid-cols-5 gap-2">
        {/* Thumbnail Image  Skeleton */}
        <div className="w-full rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
          <SkeletonBox height={200} />
        </div>

        {/* Blog Content Skeleton */}
        <div className="flex flex-col gap-1 md:gap-2 sm:col-span-3 lg:col-span-4">
          {/* Title Skeleton */}
          <div className="">
            <SkeletonBox height={25} />
          </div>

          {/* Categories Skeleton */}
          <div className="flex gap-2 md:my-2 max-md:mb-1">
            <SkeletonBox width={75} />
            <SkeletonBox width={75} />
            <SkeletonBox width={75} />
          </div>

          {/* Content */}
          <div>
            <SkeletonBox count={5} />
          </div>
        </div>
      </div>


      <div className="flex max-sm:flex-col justify-between md:mt-2 max-md:mt-0">
        <div className="">
          <SkeletonBox width={100} />
        </div>
        <div className="flex max-sm:justify-between">
          <div className="flex gap-4 md:gap-6 sm:px-6">
            <SkeletonBox width={100} />
          </div>
          <SkeletonBox width={100} />
        </div>
      </div>
    </div>
  );
}

const MyBlogSkeleton = () => {
  return (
    <>
      <div className="">
        <div className="flex justify-between my-1 items-center">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width={150} height={25} />
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width={120} height={15} />
        </div>
        <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' height={70} />

        <div className="grid max-md:my-3 md:my-6 max-md:ml-0 md:ml-4 max-md:gap-2 md:gap-4">
          {[...Array(2)].map((_, index) => (

            <BlogBoxSkeleton key={index} />

          ))}
        </div>
      </div>
    </>
  )
}

export default MyBlogSkeleton
