"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[88vh] mb-4 flex items-center bg-gray-50 dark:bg-[#0a0a14] overflow-hidden select-none" id="home">

      {/* Background image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20" style={{ backgroundImage: `url('/assets/images/bg-hero.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 dark:from-[#0a0a14] via-transparent to-gray-50 dark:to-[#0a0a14]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs — subtle in light, vivid in dark */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-400/10 dark:bg-violet-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 w-full py-10 md:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
              <span className="text-indigo-600 dark:text-indigo-300 text-xs font-semibold tracking-widest uppercase">Now on Play Store</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Write.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                Publish.
              </span>
              <br />
              Inspire.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10"
            >
              Blogotypo is a modern blogging platform where writers, thinkers, and creators share ideas, grow audiences, and make an impact — completely free.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => router.push("/dashboard")}
                className="group px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-gray-100 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-[0_0_30px_rgba(99,91,255,0.4)] text-sm"
              >
                <span className="flex items-center gap-2">
                  Start Writing Free
                  <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>

              <a
                href="https://play.google.com/store/apps/details?id=com.im_moin.blogotypo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                className="flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 dark:bg-gray-50/5 hover:bg-gray-50 dark:hover:bg-gray-50/10 border border-gray-200 dark:border-gray-100/10 hover:border-gray-300 dark:hover:border-gray-100/20 text-gray-700 dark:text-gray-100 font-semibold rounded-xl transition-all duration-300 text-sm shadow-sm"
              >
                <i className="fa-brands fa-google-play text-green-500 text-base" />
                Get the App
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { label: "Free Forever", icon: "fa-solid fa-check-circle", color: "text-emerald-500 dark:text-emerald-400" },
                { label: "Mobile App", icon: "fa-solid fa-mobile-screen", color: "text-indigo-500 dark:text-indigo-400" },
                { label: "No Ads", icon: "fa-solid fa-shield", color: "text-violet-500 dark:text-violet-400" },
              ].map(({ label, icon, color }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <i className={`${icon} ${color} text-base`} />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Logo visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="flex-shrink-0 relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-600/20 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
              <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-600/30 dark:to-violet-700/30 border border-indigo-200 dark:border-violet-400/20 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-xl shadow-indigo-200 dark:shadow-[0_0_60px_rgba(99,91,255,0.5)]"
                >
                  <Image src="/assets/images/favicon.jpg" fill alt="Blogotypo" className="object-cover" />
                </motion.div>
              </div>
            </div>

            {/* Floating badge — Play Store */}
            <motion.a
              href="https://play.google.com/store/apps/details?id=com.im_moin.blogotypo"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{ textDecoration: 'none' }}
              className="absolute -bottom-4 -right-4 md:-right-8 flex items-center gap-2 bg-gray-50 dark:bg-[#12122a] border border-gray-200 dark:border-indigo-500/30 rounded-xl px-3 py-2.5 shadow-lg hover:border-indigo-400 dark:hover:border-indigo-400/60 transition-all duration-300 cursor-pointer"
            >
              <i className="fa-brands fa-google-play text-green-500 text-lg" />
              <div>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Get it on</p>
                <p className="text-gray-900 dark:text-gray-100 text-xs font-bold">Play Store</p>
              </div>
            </motion.a>

            {/* Floating badge — Free */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute -top-4 -left-4 md:-left-8 flex items-center gap-2 bg-gray-50 dark:bg-[#12122a] border border-gray-200 dark:border-violet-500/30 rounded-xl px-3 py-2.5 shadow-lg"
            >
              <i className="fa-solid fa-pen-nib text-violet-500 dark:text-violet-400 text-base" />
              <div>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Platform</p>
                <p className="text-gray-900 dark:text-gray-100 text-xs font-bold">100% Free</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-400 dark:text-gray-600"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-400 dark:from-gray-600 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
};

export default Hero;