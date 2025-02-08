import SkeletonBox from '@components/Skeletons/Skeleton'

const BlogSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Blog Title and Meta Info */}
      <div>
        <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="60%" height={32} />
        <div className="flex justify-between text-sm md:text-base mt-2">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="30%" height={20} />
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="20%" height={20} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, index) => (
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' key={index} width={80} height={24} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 lg:gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Thumbnail Image */}
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="100%" height={500} />

          {/* Blog Content */}
          <div className="flex flex-col gap-3">
            <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' count={20} width="100%" height={16} />
          </div>
        </div>

        {/* Sidebar Recommendations */}
        <div className="lg:col-span-1 lg:pl-4 lg:flex lg:flex-col lg:gap-4 hidden">
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' count={4} width="100%" height={300} />
        </div>
      </div>

      <hr className="border-2 border-gray-500 rounded-md" />

      {/* Share Section */}
      <div>
        <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width={100} height={24} />
        <div className="flex space-x-4 text-4xl md:text-5xl mt-2">
          {[...Array(5)].map((_, index) => (
            <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' key={index} width={40} height={40} circle />
          ))}
        </div>
      </div>

      <hr className="border-2 border-gray-500 rounded-md" />

      {/* Reviews Section */}
      <div>
        <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width={120} height={32} />

        {/* Review Form */}
        <div className="flex flex-col gap-4 my-2">
          {/* Rating Stars */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, index) => (
              <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' key={index} width={32} height={32} circle />
            ))}
          </div>

          <div className="flex gap-2">
            <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width="80%" height={40} />
            <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' width={80} height={40} />
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid md:grid-cols-2 gap-2 md:gap-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' key={index} width="100%" height={80} />
          ))}
        </div>
      </div>

      {/* Sidebar Box for Small Screens */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonBox baseColor='#f3f3f3' highlightColor='#e0e0e0' key={index} width="100%" height={120} />
        ))}
      </div>
    </div>
  )
}

export default BlogSkeleton
