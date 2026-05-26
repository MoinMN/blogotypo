"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  if (!canGoBack) return null;

  return (
    <button
      onClick={() => router.back()}
      className="
    group relative inline-flex items-center gap-2
    h-10 md:h-11
    px-3.5 md:px-4
    rounded-2xl

    bg-gray-100/[0.02] dark:bg-gray-100/[0.02]
    border border-gray-200 dark:border-gray-100/[0.06]

    text-gray-600 dark:text-gray-100/45
    hover:text-gray-900 dark:hover:text-gray-100/90

    hover:bg-gray-100 dark:hover:bg-indigo-500/[0.08]
    hover:border-gray-300 dark:hover:border-indigo-400/20

    active:scale-[0.98]

    backdrop-blur-sm
    transition-all duration-200
  "
    >
      {/* glow */}
      <div
        className="
      absolute inset-0 rounded-2xl
      opacity-0 group-hover:opacity-100
      bg-gradient-to-r
      from-indigo-500/[0.03]
      via-violet-500/[0.02]
      to-fuchsia-500/[0.03]
      transition-opacity duration-300
    "
      />

      {/* icon */}
      <span
        className="
      relative inline-flex items-center justify-center
      w-7 h-7 md:w-8 md:h-8
      rounded-xl

      bg-gray-100 dark:bg-gray-100/[0.04]

      group-hover:bg-indigo-500/10
      transition-all duration-200
    "
      >
        <i
          className="
        fa-solid fa-arrow-left
        text-[10px] md:text-xs

        text-gray-500 dark:text-gray-100/35
        group-hover:text-indigo-500 dark:group-hover:text-indigo-300

        group-hover:-translate-x-0.5
        transition-all duration-200
      "
        />
      </span>

      {/* text */}
      <span
        className="
      relative
      text-[13px] md:text-sm
      font-medium tracking-wide
    "
      >
        Back
      </span>
    </button>
  );
};

export default BackButton;