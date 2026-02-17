"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // If there's previous history entry
    setCanGoBack(window.history.length > 1);
  }, []);

  if (!canGoBack) return null;

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 border border-gray-300 hover:bg-[#3D52A0] hover:text-white hover:border-gray-400 transition duration-200"
    >
      <i className="fa-solid fa-arrow-left text-lg"></i> Back
    </button>
  );
};

export default BackButton;
