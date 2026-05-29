"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CategoryBox = ({ category, key }) => {
  const router = useRouter();
  const [imgErr, setImgErr] = useState({});

  return (
    <button
      key={key}
      onClick={() => router.push(`/blog/category/${category.name}`)}
      className="
        group 
        relative 
        overflow-hidden 
        rounded-2xl 
        aspect-[1/1.05]
        text-left
        border border-gray-200 dark:border-gray-100/[0.07]
        bg-gray-100 dark:bg-[#0f0f22]
        shadow-sm
      "
    >
      {/* ── Background Image ── */}
      <div className="absolute inset-0">
        {!imgErr[category.name] ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            unoptimized
            className="
                    object-cover
                    group-hover:scale-110
                    transition-transform duration-700
                  "
            onError={() =>
              setImgErr((prev) => ({
                ...prev,
                [category.name]: true,
              }))
            }
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-500/20 flex items-center justify-center">
            <i className={`${category.icon} text-3xl text-indigo-500 dark:text-indigo-400`} />
          </div>
        )}
      </div>

      {/* ── Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 group-hover:from-black/90 transition-all duration-300" />

      {/* ── Glow ── */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/10 to-violet-500/10" />

      {/* ── Content ── */}
      <div className="relative h-full flex flex-col justify-between max-md:p-3 md:p-4">

        {/* Icon */}
        <div className="flex justify-end">
          <div className="
                  flex items-center justify-center
                  max-md:w-8 max-md:h-8
                  md:w-10 md:h-10
                  rounded-full
                  bg-gray-100/10 backdrop-blur-md
                  border border-gray-100/10
                  text-gray-100
                ">
            <i className={`${category.icon} max-md:text-xs md:text-sm`} />
          </div>
        </div>

        {/* Bottom Content */}
        <div>
          <div className="flex items-center gap-2 max-md:mb-1 md:mb-1.5">
            <div className="w-5 h-px bg-indigo-400" />
            <span className="text-gray-100/70 uppercase tracking-[0.2em] max-md:text-[9px] md:text-[10px] font-semibold">
              Category
            </span>
          </div>

          <h3
            className="
                    text-gray-100
                    font-bold
                    capitalize
                    leading-tight
                    group-hover:text-indigo-200
                    transition-colors duration-300
                    max-md:text-sm
                    md:text-lg
                  "
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {category.name}
          </h3>

          <div className="flex items-center gap-1.5 max-md:mt-2 md:mt-3 text-gray-100/70 group-hover:text-indigo-200 transition-colors duration-300">
            <span className="max-md:text-[10px] md:text-xs font-medium">
              Explore blogs
            </span>

            <i className="fa-solid fa-arrow-right max-md:text-[9px] md:text-[10px] group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </button>
  )
}

export default CategoryBox
