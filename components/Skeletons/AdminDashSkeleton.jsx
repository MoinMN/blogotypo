import SkeletonBox from "@components/Skeletons/Skeleton";

const StatCardSkeleton = () => {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl md:rounded-3xl
        border border-gray-200 dark:border-gray-800
        bg-gray-100 dark:bg-[#0f0f22]
        p-3 md:p-5
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.28)]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <SkeletonBox
            width={90}
            height={10}
          />

          <div className="mt-3">
            <SkeletonBox
              width={110}
              height={34}
            />
          </div>

          <div className="mt-3">
            <SkeletonBox
              width={130}
              height={24}
              borderRadius={999}
            />
          </div>
        </div>

        <SkeletonBox
          width={56}
          height={56}
          borderRadius={18}
        />
      </div>
    </div>
  );
};

const QuickActionSkeleton = () => {
  return (
    <div
      className="
        rounded-2xl
        border border-gray-200 dark:border-gray-800
        bg-gray-100 dark:bg-[#0f0f22]
        p-4
      "
    >
      <SkeletonBox
        width={42}
        height={42}
        borderRadius={14}
      />

      <div className="mt-4 flex flex-col gap-2">
        <SkeletonBox
          width="60%"
          height={18}
        />

        <SkeletonBox
          width="100%"
          height={12}
        />

        <SkeletonBox
          width="80%"
          height={12}
        />
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-7">

      {/* Hero Header */}
      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-gray-200 dark:border-gray-100/[0.06]
          bg-gray-100 dark:bg-[#0f0f22]
          px-4 py-5
          md:px-8 md:py-7
        "
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          {/* Left */}
          <div className="flex-1">
            <SkeletonBox
              width={90}
              height={12}
            />

            <div className="mt-3">
              <SkeletonBox
                width="60%"
                height={44}
              />
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <SkeletonBox
                width="95%"
                height={14}
              />

              <SkeletonBox
                width="70%"
                height={14}
              />
            </div>
          </div>

          {/* Right mini stats */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-[320px]">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="
                  rounded-2xl
                  border border-gray-200 dark:border-gray-100/[0.06]
                  bg-gray-200 dark:bg-gray-100/[0.03]
                  p-4
                "
              >
                <SkeletonBox
                  width={70}
                  height={10}
                />

                <div className="mt-3">
                  <SkeletonBox
                    width={60}
                    height={28}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
          gap-3 md:gap-5
        "
      >
        {[...Array(6)].map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4">
          <SkeletonBox
            width={130}
            height={12}
          />
        </div>

        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
            gap-3 md:gap-4
          "
        >
          {[...Array(4)].map((_, index) => (
            <QuickActionSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;