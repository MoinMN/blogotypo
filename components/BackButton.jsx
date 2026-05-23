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
        group inline-flex items-center gap-2
        px-3 py-1.5 rounded-xl
        text-gray-500 dark:text-gray-100/40
        hover:text-gray-900 dark:hover:text-gray-100
        bg-transparent
        hover:bg-gray-100 dark:hover:bg-gray-100/[0.05]
        border border-transparent
        hover:border-gray-200 dark:hover:border-gray-100/[0.08]
        text-sm font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/40 focus:ring-offset-1
      "
    >
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-100/[0.06] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all duration-200">
        <i className="fa-solid fa-arrow-left text-[10px] text-gray-400 dark:text-gray-100/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:-translate-x-0.5 transition-all duration-200" />
      </span>
      <span className="tracking-wide text-gray-500 dark:text-gray-100/40 group-hover:text-gray-800 dark:group-hover:text-gray-100/70 transition-colors duration-200">
        Back
      </span>
    </button>
  );
};

export default BackButton;