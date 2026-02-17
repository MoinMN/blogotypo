"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const HorizontalBlogList = ({ list, header }) => {
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
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="montserrat_alternates_font font-semibold text-lg md:text-2xl lg:text-3xl">{header}</h3>

      <div className="relative">
        {/* Previous Button */}
        {showPrev && (
          <button
            onClick={() => scroll("left")}
            className={`absolute flex justify-start items-center px-2 left-0 top-1/2 -translate-y-1/2 z-10 w-12 md:w-20 h-full transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"} bg-gradient-to-r from-black via-transparent to-transparent`}
          >
            <i className="fa-solid fa-angle-left text-lg md:text-3xl text-white drop-shadow-lg" />
          </button>
        )}

        {/* Scrollable container with extra padding to avoid content overlap */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto md:gap-4 max-md:gap-2 scrollbar_hide md:p-2 max-md:p-1 scroll-smooth pl-12 pr-12"
        >
          {list?.map((abc, index) => (
            <Link
              href={`/blog/${abc?.slug}`}
              className="relative w-[130px] h-[120px] md:w-[300px] md:h-[200px] flex-shrink-0 transition-all duration-300 ease-in-out bg-black rounded-xl shadow-md hover:shadow-lg group"
              key={index}
            >
              <div className="relative w-full h-full overflow-hidden rounded-xl shadow-md">
                {/* Thumbnail image */}
                <Image
                  src={abc.thumbnail_image}
                  fill
                  alt={abc.title}
                  className="absolute inset-0 opacity-80 group-hover:opacity-65 transition-all duration-300 ease-in-out group-hover:scale-110"
                  sizes="(max-width: 600px) 130px, (max-width: 1024px) 300px, 300px"
                />
              </div>

              {/* Title */}
              <h3 className="absolute -bottom-2 rounded-xl left-0 right-0 z-10 md:p-3 max-md:p-1.5 bg-gradient-to-t from-black via-transparent to-transparent text-white text-base md:text-lg lg:text-2xl transition-all duration-300 ease-in-out leading-5">
                {abc?.title?.length > 60 ? `${abc.title.substr(0, 60)}...` : abc.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Next Button */}
        {showNext && (
          <button
            onClick={() => scroll("right")}
            className={`absolute flex justify-end items-center px-2 right-0 top-1/2 -translate-y-1/2 z-10 w-12 md:w-20 h-full transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"} bg-gradient-to-l from-black via-transparent to-transparent`}
          >
            <i className="fa-solid fa-angle-right text-lg md:text-3xl text-white drop-shadow-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalBlogList;
