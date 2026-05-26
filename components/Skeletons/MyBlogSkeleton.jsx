import SkeletonBox from "@components/Skeletons/Skeleton";

export const BlogBoxSkeleton = () => {
  return (
    <div
      className="
        group
        border-b border-gray-200 dark:border-gray-800
        py-4 md:py-5
        transition-colors duration-200
      "
    >
      <div className="flex gap-3 md:gap-4">

        {/* ── Thumbnail ── */}
        <div
          className="
        flex-shrink-0
        w-28 h-28
        sm:w-32 sm:h-24
        md:w-44 md:h-28
        overflow-hidden rounded-xl
      "
        >
          <SkeletonBox
            width="100%"
            height="100%"
            borderRadius={12}
          />
        </div>

        {/* ── Right Content ── */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Title */}
          <div className="space-y-2">
            <SkeletonBox
              width="92%"
              height={22}
              borderRadius={8}
            />

            <SkeletonBox
              width="70%"
              height={22}
              borderRadius={8}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[...Array(3)].map((_, index) => (
              <SkeletonBox
                key={index}
                width={70}
                height={20}
                borderRadius={999}
              />
            ))}
          </div>

          {/* Description */}
          <div className="hidden sm:flex flex-col gap-2 mt-3">
            <SkeletonBox width="100%" height={12} />
            <SkeletonBox width="95%" height={12} />
            <SkeletonBox width="75%" height={12} />
          </div>

          {/* Meta */}
          <div
            className="
          flex items-center justify-between
          gap-3
          mt-auto pt-4
        "
          >
            {/* Left meta */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
              <SkeletonBox width={75} height={12} />
              <SkeletonBox width={45} height={12} />
              <SkeletonBox width={45} height={12} />
              <SkeletonBox width={18} height={18} borderRadius={6} />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <SkeletonBox width={38} height={12} />
              <SkeletonBox width={50} height={12} />
            </div>
          </div>
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