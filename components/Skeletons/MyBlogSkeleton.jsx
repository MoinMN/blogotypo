import SkeletonBox from "@components/Skeletons/Skeleton";

export const BlogBoxSkeleton = () => {
  return (
    <div
      className="
        bg-slate-100 dark:bg-[#111827]
        md:py-4 max-md:py-2
        md:px-6 max-md:px-3
        rounded-2xl
        border border-gray-200 dark:border-gray-800
        shadow-sm hover:shadow-lg dark:hover:shadow-black/20
        transition-all duration-300 ease-in-out
      "
    >
      <div className="flex flex-col sm:grid sm:grid-cols-5 gap-3">

        {/* Thumbnail Image */}
        <div className="w-full rounded-xl overflow-hidden sm:col-span-2 lg:col-span-1">
          <SkeletonBox
            height={200}
            borderRadius={14}
          />
        </div>

        {/* Blog Content */}
        <div className="flex flex-col gap-2 sm:col-span-3 lg:col-span-4">

          {/* Title */}
          <SkeletonBox
            height={25}
            width="92%"
          />

          {/* Categories */}
          <div className="flex flex-wrap gap-2 md:my-1">
            <SkeletonBox width={75} height={24} borderRadius={30} />
            <SkeletonBox width={75} height={24} borderRadius={30} />
            <SkeletonBox width={75} height={24} borderRadius={30} />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <SkeletonBox width="100%" height={14} />
            <SkeletonBox width="95%" height={14} />
            <SkeletonBox width="90%" height={14} />
            <SkeletonBox width="80%" height={14} />
          </div>
        </div>
      </div>

      {/* Bottom Meta */}
      <div className="flex max-sm:flex-col justify-between gap-3 md:mt-4 mt-3">

        <SkeletonBox
          width={110}
          height={16}
        />

        <div className="flex items-center max-sm:justify-between gap-4 sm:gap-6">
          <SkeletonBox
            width={90}
            height={16}
          />

          <SkeletonBox
            width={90}
            height={16}
          />
        </div>
      </div>
    </div>
  );
};

const MyBlogSkeleton = () => {
  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center gap-3 my-2">
        <SkeletonBox
          width={180}
          height={30}
        />

        <SkeletonBox
          width={130}
          height={36}
          borderRadius={10}
        />
      </div>

      {/* Top banner / filter */}
      <SkeletonBox
        height={70}
        borderRadius={16}
      />

      {/* Blog list */}
      <div className="grid max-md:my-3 md:my-6 max-md:gap-3 md:gap-4">
        {[...Array(3)].map((_, index) => (
          <BlogBoxSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default MyBlogSkeleton;