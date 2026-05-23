"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BackButton from "@components/BackButton";
import { H1Header } from "@components/Header";

const CategoryPages = () => {
  const router = useRouter();

  const [imgErr, setImgErr] = useState({});

  const categories = [{
    name: "sports",
    image: "https://media.istockphoto.com/id/1295248329/photo/beautiful-young-black-boy-training-on-the-football-pitch.jpg?s=612x612&w=0&k=20&c=ws4m_NoSF8fRZGNoq5kVlJSfNghREKihaxsOBXAHOw8=",
    icon: "fa-solid fa-football",
  },
  {
    name: "technology",
    image: "https://t4.ftcdn.net/jpg/03/08/69/75/360_F_308697506_9dsBYHXm9FwuW0qcEqimAEXUvzTwfzwe.jpg",
    icon: "fa-solid fa-microchip",
  },
  {
    name: "entertainment",
    image: "https://www.shutterstock.com/image-photo/crowd-partying-stage-lights-live-260nw-2297236461.jpg",
    icon: "fa-solid fa-film",
  },
  {
    name: "fashion",
    image: "https://t4.ftcdn.net/jpg/04/84/87/61/360_F_484876187_u6HIlCgA2iZdfkoOamuQa43OJH2zaDVR.jpg",
    icon: "fa-solid fa-shirt",
  },
  {
    name: "science",
    image: "https://thumbs.dreamstime.com/b/science-lab-chemicals-14262437.jpg",
    icon: "fa-solid fa-flask",
  },
  {
    name: "business",
    image: "https://plus.unsplash.com/premium_photo-1661497675847-2075003562fd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29ycG9yYXRlfGVufDB8fDB8fHww",
    icon: "fa-solid fa-briefcase",
  },
  {
    name: "lifestyle",
    image: "https://images.pexels.com/photos/1223649/pexels-photo-1223649.jpeg?cs=srgb&dl=pexels-ollivves-1223649.jpg&fm=jpg",
    icon: "fa-solid fa-spa",
  },
  {
    name: "health",
    image: "https://media.istockphoto.com/id/1363588189/photo/healthy-lifestyle-on-ketogenic-diet-eating-clean-keto-food-good-health-dietary-in-heart-dish.jpg?s=612x612&w=0&k=20&c=RVW_a2Bq3eYeUWqkUbTUHkiQbGJaAMa9Q2fyljGymgY=",
    icon: "fa-solid fa-heart-pulse",
  },
  {
    name: "education",
    image: "https://media.istockphoto.com/id/1409722748/photo/students-raising-hands-while-teacher-asking-them-questions-in-classroom.jpg?s=612x612&w=0&k=20&c=NbVChOV9wIbQOhUD6BqpouZHHBbyQ2rkSjaVfIhpMv8=",
    icon: "fa-solid fa-graduation-cap",
  },
  {
    name: "finance",
    image: "https://media.istockphoto.com/id/1503371245/photo/percentage-sign-on-top-of-coin-stacks-before-blue-financial-graph.jpg?s=612x612&w=0&k=20&c=T9YGg7XIZTG_8E2h1xsTaQkdLGCTjkX_rnMr0adtAQk=",
    icon: "fa-solid fa-chart-line",
  },
  {
    name: "travel",
    image: "https://t4.ftcdn.net/jpg/00/65/48/25/360_F_65482539_C0ZozE5gUjCafz7Xq98WB4dW6LAhqKfs.jpg",
    icon: "fa-solid fa-plane",
  },
  {
    name: "art",
    image: "https://media.istockphoto.com/id/636761588/photo/used-brushes-on-an-artists-palette-of-colorful-oil-paint.jpg?s=612x612&w=0&k=20&c=38YQxVJVWnNfvGtlb7AXMx_ItyHZMEdmWenNkWNQ91g=",
    icon: "fa-solid fa-palette",
  },
  {
    name: "food",
    image: "https://media.istockphoto.com/id/1316145932/photo/table-top-view-of-spicy-food.jpg?s=612x612&w=0&k=20&c=eaKRSIAoRGHMibSfahMyQS6iFADyVy1pnPdy1O5rZ98=",
    icon: "fa-solid fa-utensils",
  },
  {
    name: "music",
    image: "https://static.vecteezy.com/system/resources/thumbnails/024/295/098/small_2x/music-notes-background-illustration-ai-generative-free-photo.jpg",
    icon: "fa-solid fa-music",
  },
  {
    name: "gaming",
    image: "https://media.istockphoto.com/id/1393796813/photo/friends-playing-computer-game.jpg?s=612x612&w=0&k=20&c=2UmNQg61SF2npo6s0tHtKdIrWCilYmX38m6IWrgnr5A=",
    icon: "fa-solid fa-gamepad",
  },
  {
    name: "automotive",
    image: "https://images.unsplash.com/photo-1539799139339-50c5fe1e2b1b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "fa-solid fa-car-side",
  }];

  return (
    <div className="max-w-7xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 max-md:mb-5 md:mb-8">
        <div className="flex items-center gap-3">
          <BackButton />

          <div>
            <div className="flex items-center gap-2 max-md:mb-1 md:mb-1.5">
              <div className="w-6 h-px bg-indigo-500" />
              <span className="text-indigo-500 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em]">
                Explore
              </span>
            </div>

            <H1Header>
              Categories
            </H1Header>
          </div>
        </div>
      </div>

      {/* ── Categories Grid ── */}
      <div
        className="
          grid 
          grid-cols-2 
          md:grid-cols-4 
          lg:grid-cols-5
          max-md:gap-3 
          md:gap-5
        "
      >
        {categories.map((category, index) => (
          <button
            key={index}
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
        ))}
      </div>
    </div>
  );
};

export default CategoryPages;