import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonBox = ({
  width,
  height,
  circle,
  baseColor,
  highlightColor,
  darkBaseColor,
  darkHighlightColor,
  count,
}) => {
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <Skeleton
      width={width}
      height={height}
      circle={circle}
      count={count}
      borderRadius={6}
      enableAnimation={true}
      className="cursor-wait"

      baseColor={
        isDark
          ? darkBaseColor || "#111827"
          : baseColor || "#EDE8F5"
      }

      highlightColor={
        isDark
          ? darkHighlightColor || "#1f2937"
          : highlightColor || "#f0f3f7"
      }
    />
  );
};

export default SkeletonBox;