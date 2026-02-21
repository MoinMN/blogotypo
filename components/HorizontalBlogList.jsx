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
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <h3 className="montserrat_alternates_font font-semibold 
                 text-xl md:text-2xl lg:text-3xl 
                 mb-4 tracking-tight">
        {header}
      </h3>

      <div className="relative">

        {/* Prev Button */}
        {showPrev && (
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-0 bottom-0
                z-20 w-10 md:w-14
                flex items-center justify-center
                rounded-l-2xl
                bg-gradient-to-r from-black/70 to-transparent
                transition-opacity duration-300
                ${isHovered ? "opacity-100" : "opacity-0"}
              `}
          >
            <i className="fa-solid fa-angle-left text-white text-lg md:text-2xl" />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-5 
                 overflow-x-auto 
                 scrollbar_hide 
                 scroll-smooth 
                 snap-x snap-mandatory
                 px-8 md:px-12"
        >
          {list?.map((abc, index) => (
            <Link
              href={`/blog/${abc?.slug}`}
              key={index}
              className="relative 
                     snap-start
                     min-w-[160px] 
                     sm:min-w-[220px] 
                     md:min-w-[280px] 
                     lg:min-w-[320px]
                     h-[140px] 
                     sm:h-[170px] 
                     md:h-[200px]
                     flex-shrink-0 
                     rounded-2xl 
                     overflow-hidden
                     shadow-md hover:shadow-xl
                     transition-all duration-300 group"
            >
              {/* Image */}
              <Image
                src={abc.thumbnail_image}
                fill
                alt={abc.title}
                className="object-cover 
                       group-hover:scale-110 
                       transition-transform duration-500"
                sizes="(max-width: 640px) 160px,
                   (max-width: 768px) 220px,
                   (max-width: 1024px) 280px,
                   320px"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 
                          bg-gradient-to-t 
                          from-black/80 via-black/40 to-transparent" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white 
                           text-sm sm:text-base md:text-lg 
                           font-semibold 
                           leading-snug 
                           line-clamp-2">
                  {abc?.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Next Button */}
        {showNext && (
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-0 bottom-0
                    z-20 w-10 md:w-14
                    flex items-center justify-center
                    rounded-r-2xl
                    bg-gradient-to-l from-black/70 to-transparent
                    transition-opacity duration-300
                    ${isHovered ? "opacity-100" : "opacity-0"}
                  `}
          >
            <i className="fa-solid fa-angle-right text-white text-lg md:text-2xl" />
          </button>
        )}

      </div>
    </div>
  );
};

export default HorizontalBlogList;
