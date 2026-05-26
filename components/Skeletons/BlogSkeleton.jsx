import SkeletonBox from '@components/Skeletons/Skeleton';

const BlogSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto max-md:px-3 md:px-6 py-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4">

        {/* Back button */}
        <div className="w-fit">
          <SkeletonBox width={90} height={36} borderRadius={14} />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <SkeletonBox width="88%" height={42} />
          <SkeletonBox width="65%" height={42} />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, index) => (
            <SkeletonBox
              key={index}
              width={90}
              height={28}
              borderRadius={999}
            />
          ))}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-gray-200 dark:border-gray-800">

          <div className="flex items-center gap-3">
            <SkeletonBox width={42} height={42} circle />

            <div className="flex flex-col gap-2">
              <SkeletonBox width={140} height={16} />
              <SkeletonBox width={90} height={12} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <SkeletonBox width={90} height={34} borderRadius={12} />
            <SkeletonBox width={90} height={34} borderRadius={12} />
          </div>
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">

        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Thumbnail */}
          <SkeletonBox
            width="100%"
            height={520}
            borderRadius={24}
          />

          {/* Blog content */}
          <div className="flex flex-col gap-3">
            <SkeletonBox width="100%" height={18} />
            <SkeletonBox width="97%" height={18} />
            <SkeletonBox width="95%" height={18} />
            <SkeletonBox width="92%" height={18} />
            <SkeletonBox width="99%" height={18} />
            <SkeletonBox width="90%" height={18} />
            <SkeletonBox width="96%" height={18} />
            <SkeletonBox width="88%" height={18} />

            <div className="py-2" />

            <SkeletonBox width="70%" height={28} />

            <SkeletonBox width="100%" height={18} />
            <SkeletonBox width="94%" height={18} />
            <SkeletonBox width="98%" height={18} />
            <SkeletonBox width="91%" height={18} />
            <SkeletonBox width="85%" height={18} />

            <div className="py-2" />

            <SkeletonBox width="55%" height={28} />

            <SkeletonBox width="100%" height={18} />
            <SkeletonBox width="96%" height={18} />
            <SkeletonBox width="92%" height={18} />
            <SkeletonBox width="98%" height={18} />
            <SkeletonBox width="80%" height={18} />
          </div>
        </div>

        {/* Sidebar desktop */}
        <div className="hidden lg:flex flex-col gap-4">

          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-4"
            >
              <SkeletonBox width={120} height={20} />

              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <SkeletonBox
                    width={70}
                    height={70}
                    borderRadius={14}
                  />

                  <div className="flex flex-col gap-2 flex-1">
                    <SkeletonBox width="100%" height={14} />
                    <SkeletonBox width="85%" height={14} />
                    <SkeletonBox width="50%" height={12} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 rounded-full" />
        <SkeletonBox width={8} height={8} circle />
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>

      {/* ── Share Section ── */}
      <div className="bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-800 rounded-2xl max-md:px-3 max-md:py-3 md:px-5 md:py-5">

        <div className="mb-4">
          <SkeletonBox width={120} height={14} />
        </div>

        <div className="flex flex-wrap gap-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonBox
              key={index}
              width={52}
              height={52}
              circle
            />
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 rounded-full" />
        <SkeletonBox width={8} height={8} circle />
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>

      {/* ── Reviews ── */}
      <div className="flex flex-col gap-6">

        {/* Reviews header */}
        <div className="flex items-center gap-3">
          <SkeletonBox width={26} height={2} />
          <SkeletonBox width={140} height={30} />
          <SkeletonBox width={36} height={24} borderRadius={999} />
        </div>

        {/* Review form */}
        <div className="bg-gray-50 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-800 rounded-2xl max-md:p-4 md:p-5 flex flex-col gap-5">

          <div className="flex flex-col gap-3">
            <SkeletonBox width={100} height={14} />

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, index) => (
                <SkeletonBox
                  key={index}
                  width={28}
                  height={28}
                  circle
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <SkeletonBox
              width="100%"
              height={70}
              borderRadius={16}
            />

            <SkeletonBox
              width={100}
              height={70}
              borderRadius={16}
            />
          </div>
        </div>

        {/* Reviews list */}
        <div className="grid md:grid-cols-2 gap-3">

          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex gap-3"
            >

              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <SkeletonBox width={36} height={36} circle />
                <SkeletonBox width={2} height={70} />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-3">

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <SkeletonBox width={90} height={14} />
                    <SkeletonBox
                      width={70}
                      height={18}
                      borderRadius={999}
                    />
                  </div>

                  <SkeletonBox width={60} height={12} />
                </div>

                {/* stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonBox
                      key={i}
                      width={12}
                      height={12}
                      circle
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <SkeletonBox width="100%" height={14} />
                  <SkeletonBox width="94%" height={14} />
                  <SkeletonBox width="70%" height={14} />
                </div>

                <div className="flex justify-end">
                  <SkeletonBox
                    width={70}
                    height={28}
                    borderRadius={10}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile Recommendations ── */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">

        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-4"
          >
            <SkeletonBox width={120} height={18} />

            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <SkeletonBox
                  width={64}
                  height={64}
                  borderRadius={12}
                />

                <div className="flex flex-col gap-2 flex-1">
                  <SkeletonBox width="100%" height={13} />
                  <SkeletonBox width="85%" height={13} />
                  <SkeletonBox width="50%" height={11} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSkeleton;