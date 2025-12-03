"use client";

import SkeletonBox from "@components/Skeletons/Skeleton";

const ExploreSkeleton = () => {
  // show 8 skeleton cards
  const skeletonCards = Array(8).fill(null);

  return (
    <div className="bg-purple-100 md:py-16 max-md:py-6 select-none">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl md:px-16 max-md:px-4 montserrat_alternates_font font-bold mb-8">
        Explore Popular Blogs
      </h1>

      {/* Cards container */}
      <div className="relative w-full overflow-hidden py-8">
        <div className="flex gap-3 md:gap-6 min-w-max">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="bg-white w-64 md:w-72 lg:w-80 flex flex-col md:p-6 max-md:p-3 
              rounded-2xl shadow-md border border-gray-200"
            >
              {/* Thumbnail skeleton */}
              <SkeletonBox
                width="100%"
                height={160}
                baseColor="#f3f3f3"
                highlightColor="#e0e0e0"
                borderRadius={16}
              />

              {/* Title skeleton */}
              <div className="mt-4 space-y-2 px-3">
                <SkeletonBox
                  width="80%"
                  height={22}
                  baseColor="#f3f3f3"
                  highlightColor="#e0e0e0"
                  borderRadius={8}
                />
                <SkeletonBox
                  width="60%"
                  height={22}
                  baseColor="#f3f3f3"
                  highlightColor="#e0e0e0"
                  borderRadius={8}
                />
              </div>

              {/* Button skeleton */}
              <div className="mt-6 px-3">
                <SkeletonBox
                  width="100%"
                  height={40}
                  baseColor="#f3f3f3"
                  highlightColor="#e0e0e0"
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
