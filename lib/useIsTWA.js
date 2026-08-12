"use client";

import { useEffect, useState } from "react";

export default function useIsTWA() {
  const [isTWA, setIsTWA] = useState(false);

  useEffect(() => {
    const isBubblewrap =
      document.referrer.startsWith("android-app://");

    setIsTWA(isBubblewrap);
  }, []);

  return isTWA;
}
