"use client";

import { animate, motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedCounter = ({ targetNumber, duration = 4, color = "#A855F7", fontSize = 64 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      count.set(0);
      animate(count, targetNumber, { duration });
    }
  }, [isInView, targetNumber, duration]);

  return (
    <motion.pre ref={ref} style={{ fontSize, color }}>
      {rounded}
    </motion.pre>
  );
};

export default AnimatedCounter;
