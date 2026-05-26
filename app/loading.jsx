"use client";

import "bootstrap/dist/css/bootstrap.min.css";

const Loading = () => {
  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gray-100 dark:bg-[#0a0a14]
        overflow-hidden
        relative
      "
    >
      {/* Background glow */}
      <div
        className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[260px] h-[260px]
          rounded-full
          bg-indigo-300/20 dark:bg-indigo-500/10
          blur-3xl
        "
      />

      {/* Grid texture */}
      <div
        className="
          absolute inset-0
          opacity-[0.03] dark:opacity-[0.04]
          [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
          dark:[background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          [background-size:28px_28px]
        "
      />

      {/* Loader */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Rotating rings */}
        <div className="relative w-24 h-24 md:w-28 md:h-28">

          {/* Outer ring */}
          <div
            className="
              absolute inset-0
              rounded-full
              border-[3px]
              border-gray-300 dark:border-white/10
            "
          />

          {/* Animated ring */}
          <div
            className="
              absolute inset-0
              rounded-full
              border-[3px]
              border-transparent
              border-t-indigo-500
              border-r-violet-500
              animate-spin
            "
          />

          {/* Inner pulse */}
          <div
            className="
              absolute inset-[18px]
              rounded-full
              bg-gradient-to-br
              from-indigo-500/20
              to-violet-500/10
              dark:from-indigo-500/20
              dark:to-violet-500/10
              backdrop-blur-sm
              flex items-center justify-center
              animate-pulse
            "
          >
            <span
              className="
                text-lg md:text-xl
                font-bold
                text-gray-900 dark:text-gray-100
                tracking-wide
              "
              style={{
                fontFamily:
                  "'Playfair Display', serif",
              }}
            >
              B
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="mt-6 text-center">
          <h2
            className="
              text-xl md:text-2xl
              font-bold
              text-gray-900 dark:text-gray-100
              tracking-wide
            "
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            Blogotypo
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500 dark:text-gray-400
              tracking-[0.2em]
              uppercase
            "
          >
            Loading Experience
          </p>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-5">
          <span
            className="
              w-2 h-2 rounded-full
              bg-indigo-500
              animate-bounce
            "
          />

          <span
            className="
              w-2 h-2 rounded-full
              bg-violet-500
              animate-bounce
              [animation-delay:0.15s]
            "
          />

          <span
            className="
              w-2 h-2 rounded-full
              bg-fuchsia-500
              animate-bounce
              [animation-delay:0.3s]
            "
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;