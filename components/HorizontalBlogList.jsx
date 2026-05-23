"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const HorizontalBlogList = ({ list, header, emoji }) => {
  const scrollRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateButtons = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setShowPrev(scrollLeft > 0);
      setShowNext(scrollLeft + clientWidth < scrollWidth - 10);
    };

    scrollRef.current?.addEventListener("scroll", updateButtons);
    updateButtons();

    return () => scrollRef.current?.removeEventListener("scroll", updateButtons);
  }, [list]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-6 h-px bg-indigo-500" />
        <h3
          className="text-gray-900 dark:text-gray-100 font-bold text-lg md:text-xl tracking-tight flex items-center gap-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {header}
          {emoji && <span className="text-base">{emoji}</span>}
        </h3>
      </div>

      <div className="relative">
        {/* Prev Button */}
        {showPrev && (
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16
              flex items-center justify-center
              rounded-l-2xl
              bg-gradient-to-r from-gray-50/95 dark:from-[#0d0d1a]/95 to-transparent
              transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-50/10 border border-gray-200 dark:border-gray-100/10 backdrop-blur-sm flex items-center justify-center shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors duration-200">
              <i className="fa-solid fa-angle-left text-gray-600 dark:text-gray-100 text-sm" />
            </div>
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4
            overflow-x-auto
            scrollbar_hide
            scroll-smooth
            snap-x snap-mandatory
            px-10 md:px-14"
        >
          {list?.map((abc, index) => (
            <Link
              href={`/blog/${abc?.slug}`}
              key={index}
              style={{ textDecoration: "none" }}
              className="relative
                snap-start
                min-w-[160px]
                sm:min-w-[210px]
                md:min-w-[265px]
                lg:min-w-[300px]
                h-[140px]
                sm:h-[165px]
                md:h-[195px]
                flex-shrink-0
                rounded-2xl
                overflow-hidden
                border border-gray-100 dark:border-gray-100/5
                hover:border-indigo-300 dark:hover:border-indigo-500/40
                shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(99,91,255,0.15)]
                transition-all duration-300 group"
            >
              {/* Image */}
              <Image
                src={abc.thumbnail_image}
                fill
                alt={abc.title}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 210px, (max-width: 1024px) 265px, 300px"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3
                  className="text-gray-100 text-xs sm:text-sm md:text-base font-semibold  line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {abc?.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-4 h-px bg-indigo-400" />
                  <span className="text-indigo-300 text-[10px] font-semibold tracking-wide">Read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Next Button */}
        {showNext && (
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16
              flex items-center justify-center
              bg-gradient-to-l from-gray-50/95 dark:from-[#0d0d1a]/95 to-transparent
              transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-50/10 border border-gray-200 dark:border-gray-100/10 backdrop-blur-sm flex items-center justify-center shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors duration-200">
              <i className="fa-solid fa-angle-right text-gray-600 dark:text-gray-100 text-sm" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalBlogList;