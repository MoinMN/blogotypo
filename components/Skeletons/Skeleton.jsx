import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonBox = ({ width, height, circle, baseColor, highlightColor, count }) => {
  return (
    <Skeleton
      width={width}
      height={height}
      circle={circle}
      count={count}

      borderRadius={6}

      baseColor={baseColor || '#EDE8F5'}
      highlightColor={highlightColor || '#f0f3f7'}
      enableAnimation={true}
      className='cursor-wait'
    />
  )
}

export default SkeletonBox
