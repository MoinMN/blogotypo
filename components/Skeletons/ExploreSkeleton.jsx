"use client";

import SkeletonBox from "@components/Skeletons/Skeleton";

const ExploreSkeleton = () => {
  const skeletonCards = Array(8).fill(null);

  return (
    <section className="bg-gray-50 dark:bg-[#0d0d1a] overflow-hidden select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto max-md:px-4 md:px-6 py-6 md:py-10">

        {/* Top label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gray-200 dark:bg-gray-800 rounded-full" />

          <SkeletonBox
            width={70}
            height={12}
            borderRadius={999}
          />
        </div>

        {/* Heading + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 md:mb-12">

          <div className="flex flex-col gap-3">
            <SkeletonBox
              width={260}
              height={38}
              borderRadius={10}
            />

            <SkeletonBox
              width={200}
              height={38}
              borderRadius={10}
            />
          </div>

          <SkeletonBox
            width={150}
            height={44}
            borderRadius={14}
          />
        </div>

        {/* Blog cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-md:gap-3 md:gap-5">

          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="
            flex flex-col overflow-hidden
            rounded-3xl
            bg-gray-100 dark:bg-[#111827]
            border border-gray-200 dark:border-gray-800
            shadow-sm dark:shadow-none
            transition-colors duration-300
          "
            >

              {/* Thumbnail */}
              <div className="p-3 pb-0">
                <SkeletonBox
                  width="100%"
                  height={190}
                  borderRadius={18}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-4">

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <SkeletonBox
                    width={65}
                    height={22}
                    borderRadius={999}
                  />

                  <SkeletonBox
                    width={80}
                    height={22}
                    borderRadius={999}
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <SkeletonBox
                    width="95%"
                    height={24}
                    borderRadius={8}
                  />

                  <SkeletonBox
                    width="72%"
                    height={24}
                    borderRadius={8}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <SkeletonBox width="100%" height={14} />
                  <SkeletonBox width="96%" height={14} />
                  <SkeletonBox width="84%" height={14} />
                </div>

                {/* Author */}
                <div className="flex items-center justify-between pt-2 mt-auto">

                  <div className="flex items-center gap-2">
                    <SkeletonBox
                      width={34}
                      height={34}
                      circle
                    />

                    <div className="flex flex-col gap-1.5">
                      <SkeletonBox width={80} height={12} />
                      <SkeletonBox width={55} height={10} />
                    </div>
                  </div>

                  <SkeletonBox
                    width={58}
                    height={22}
                    borderRadius={999}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSkeleton;