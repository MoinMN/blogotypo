"use client";

import { useEffect } from "react";

const useMetadata = (title, description, ogImage = "/opengraph-image.jpg") => {
  useEffect(() => {
    document.title = title;

    const setMetaTag = (name, content) => {
      let metaTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (metaTag) {
        metaTag.setAttribute("content", content);
      } else {
        metaTag = document.createElement("meta");
        metaTag.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        metaTag.setAttribute("content", content);
        document.head.appendChild(metaTag);
      }
    };

    setMetaTag("description", description);
    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:image", ogImage);
  }, [title, description, ogImage]);
};

export default useMetadata;
