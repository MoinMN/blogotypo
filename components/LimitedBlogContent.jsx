"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import SkeletonBox from "./Skeletons/Skeleton";

const truncateHTML = (html, maxLength) => {
  if (typeof window !== "undefined") {
    const cleanHTML = DOMPurify.sanitize(html);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = cleanHTML;
    const plainText = tempElement.textContent || tempElement.innerText || "";
    return plainText.length > maxLength
      ? `${plainText.substring(0, maxLength).trim()}...`
      : plainText;
  }
  return ""; // Return empty string if running on the server
};

const LimitedBlogContent = ({ content, maxLengthSM, maxLengthMD }) => {
  const [maxLength, setMaxLength] = useState(maxLengthMD); // Default to MD
  const [truncatedContent, setTruncatedContent] = useState("");

  // Update maxLength based on screen size
  useEffect(() => {
    const updateMaxLength = () => {
      if (window.innerWidth <= 640) {
        // Small screens
        setMaxLength(maxLengthSM);
      } else {
        // Medium and larger screens
        setMaxLength(maxLengthMD);
      }
    };

    // Run on mount and add resize event listener
    updateMaxLength();
    window.addEventListener("resize", updateMaxLength);

    return () => window.removeEventListener("resize", updateMaxLength);
  }, [maxLengthSM, maxLengthMD]);

  // Truncate content based on maxLength
  useEffect(() => {
    if (content) {
      setTruncatedContent(truncateHTML(content, maxLength));
    }
  }, [content, maxLength]);

  return (
    <>
      <p
        className=""
        dangerouslySetInnerHTML={{
          __html: truncatedContent,
        }}
      />
    </>
  );
};

export default LimitedBlogContent;
