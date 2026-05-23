"use client";

import SkeletonBox from "@components/Skeletons/Skeleton";

const ExploreSkeleton = () => {
  const skeletonCards = Array(8).fill(null);

  return (
    <div className="bg-purple-100 dark:bg-[#0b1020] md:py-16 max-md:py-6 select-none transition-colors duration-300">

      {/* Heading */}
      <div className="md:px-16 max-md:px-4 mb-8">
        <SkeletonBox
          width={260}
          height={36}
        />
      </div>

      {/* Cards container */}
      <div className="relative w-full overflow-hidden py-4">
        <div className="flex gap-3 md:gap-6 min-w-max md:px-16 max-md:px-4">

          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="
                w-64 md:w-72 lg:w-80 flex flex-col
                md:p-6 max-md:p-3
                rounded-2xl
                bg-gray-100 dark:bg-[#111827]
                border border-gray-200 dark:border-gray-800
                shadow-sm dark:shadow-none
                transition-colors duration-300
              "
            >
              {/* Thumbnail */}
              <SkeletonBox
                width="100%"
                height={160}
                borderRadius={16}
              />

              {/* Title */}
              <div className="mt-4 space-y-3 px-1">
                <SkeletonBox
                  width="85%"
                  height={22}
                  borderRadius={8}
                />

                <SkeletonBox
                  width="60%"
                  height={22}
                  borderRadius={8}
                />
              </div>

              {/* Content lines */}
              <div className="mt-5 flex flex-col gap-2 px-1">
                <SkeletonBox
                  width="100%"
                  height={14}
                />

                <SkeletonBox
                  width="95%"
                  height={14}
                />

                <SkeletonBox
                  width="75%"
                  height={14}
                />
              </div>

              {/* Button */}
              <div className="mt-6 px-1">
                <SkeletonBox
                  width="100%"
                  height={42}
                  borderRadius={12}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreSkeleton;