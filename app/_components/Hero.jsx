"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="relative scroll-mt-20 h-[85vh] md:h-[90vh] text-white select-none" id="home">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/assets/images/bg-hero.jpg'})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-25" />

        {/* Centered Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="relative flex flex-col gap-8 md:gap-12 items-center justify-center h-full text-center px-6 backdrop-blur-[2px]"
        >
          {/* Logo and Name */}
          <div className="flex gap-2 md:gap-4 items-center justify-center">
            <motion.div
              variants={{
                hidden: { rotateY: 90, opacity: 0 },
                visible: { rotateY: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
              }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-48 lg:h-48"
            >
              <Image
                src={process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/assets/images/favicon.jpg'}
                alt="Blogotypo Logo"
                fill
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
              />
            </motion.div>

            {/* Blogotypo Name with Staggered Letter Animation */}
            <motion.h1
              variants={{
                hidden: { rotateX: 90, opacity: 0 },
                visible: { rotateX: 0, opacity: 1, transition: { duration: 1, delay: 0.3, ease: "easeOut" } },
              }}
              className="playwrite_in_font font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#8785FF] drop-shadow-[2px_2px_0px_#D3D2FE]"
            >
              {"Blogotypo".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: index * 0.2, ease: "easeOut" } },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Description */}
          <motion.div
            variants={{
              hidden: { rotateX: -90, opacity: 0 },
              visible: { rotateX: 0, opacity: 1, transition: { duration: 1, delay: 0.9, ease: "easeOut" } },
            }}
            className="flex flex-col gap-1 md:gap-2 text-2xl md:text-3xl caveat_font w-full md:max-w-3xl font-medium"
          >
            <span>🚀 Unleash Your Thoughts on Blogotypo!</span>
            <span>✍️ Share your knowledge, ideas, and stories with the world.</span>
            <span>📖 Explore a variety of topics and engage with like-minded bloggers.</span>
            <span>📝 Write. Publish. Inspire.</span>
            <span>👉 Start Your Blogging Journey Now!</span>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            variants={{
              hidden: { rotateY: -180, opacity: 0 },
              visible: { rotateY: 0, opacity: 1, transition: { duration: 1, delay: 1.1, ease: "easeOut" } },
            }}
            onClick={() => router.push('/user/dashboard')}
            className="relative overflow-hidden transition-all duration-500 group md:px-6 max-md:px-4 md:py-3 max-md:py-1.5 bg-[#8785FF] text-white text-base md:text-lg font-semibold rounded-lg shadow-lg"
          >
            <span className="absolute inset-0 bg-[#6b68d6] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
            <span className="relative z-10">
              Get Started For Free
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
