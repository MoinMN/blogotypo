"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { useEffect, useState } from "react";

const WhyBlogotypo = () => {
  const reasons = [
    { icon: "fa-solid fa-infinity", lightColor: "text-indigo-600", darkColor: "dark:text-indigo-400", lightBg: "bg-indigo-50 border-indigo-200", darkBg: "dark:bg-indigo-500/5 dark:border-indigo-500/20", text: "100% Free — Always", desc: "No hidden fees, no plans, no limits." },
    { icon: "fa-solid fa-pen-ruler", lightColor: "text-violet-600", darkColor: "dark:text-violet-400", lightBg: "bg-violet-50 border-violet-200", darkBg: "dark:bg-violet-500/5 dark:border-violet-500/20", text: "Rich Text Editor", desc: "Format beautifully with our powerful editor." },
    { icon: "fa-solid fa-layer-group", lightColor: "text-sky-600", darkColor: "dark:text-sky-400", lightBg: "bg-sky-50 border-sky-200", darkBg: "dark:bg-sky-500/5 dark:border-sky-500/20", text: "Blog Management", desc: "Create, edit, and organize with ease." },
    { icon: "fa-solid fa-comments", lightColor: "text-amber-600", darkColor: "dark:text-amber-400", lightBg: "bg-amber-50 border-amber-200", darkBg: "dark:bg-amber-500/5 dark:border-amber-500/20", text: "Reviews & Ratings", desc: "Readers engage directly with your content." },
    { icon: "fa-solid fa-certificate", lightColor: "text-emerald-600", darkColor: "dark:text-emerald-400", lightBg: "bg-emerald-50 border-emerald-200", darkBg: "dark:bg-emerald-500/5 dark:border-emerald-500/20", text: "Verified Creators", desc: "Top writers get recognized on the platform." },
    { icon: "fa-brands fa-google-play", lightColor: "text-green-600", darkColor: "dark:text-green-400", lightBg: "bg-green-50 border-green-200", darkBg: "dark:bg-green-500/5 dark:border-green-500/20", text: "Android App", desc: "Blog from anywhere, anytime on mobile." },
  ];

  const [userCount, setUserCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/count', { method: "GET" });
        const data = await res.json();
        if (res.ok) { setUserCount(data.users); setBlogCount(data.blogs); }
      } catch (e) { console.log('Error fetching counts', e); }
    };
    fetchCounts();
  }, []);

  return (
    <section id="why-blogotypo" className="bg-gray-50 dark:bg-[#0a0a14] scroll-mt-20 p-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-amber-500" />
          <span className="text-amber-500 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase">Why Blogotypo</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The platform that<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 dark:from-amber-400 dark:to-rose-400">respects your craft.</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-12 max-w-xl">
          We built what we'd want to use — a fast, focused, free blogging platform with no distractions.
        </motion.p>

        {/* Reasons grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 max-md:gap-3 md:gap-4 mb-12">
          {reasons.map(({ icon, lightColor, darkColor, lightBg, darkBg, text, desc }, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group flex items-start max-md:gap-2 md:gap-4 max-md:px-3 max-md:py-2 md:p-4 border ${lightBg} ${darkBg} bg-gray-50 dark:bg-transparent rounded-2xl hover:shadow-sm dark:hover:scale-[1.02] transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl ${lightBg} ${darkBg} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${icon} ${lightColor} ${darkColor} text-base`} />
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{text}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats + App CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 max-md:gap-3 md:gap-4">
          {/* Users */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center max-md:px-4 max-md:py-3 md:p-4 bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-indigo-600/20 dark:to-indigo-600/5 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl text-center overflow-hidden"
          >
            <i className="fa-solid fa-users text-indigo-500 dark:text-indigo-400 text-2xl mb-3" />
            <div className="overflow-hidden flex items-center justify-center w-full text-gray-900 dark:text-gray-100 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              <AnimatedCounter targetNumber={userCount} fontSize={48} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Registered Users</p>
          </motion.div>

          {/* Blogs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center justify-center max-md:px-4 max-md:py-3 md:p-4 bg-gradient-to-br from-violet-50 to-gray-100 dark:from-violet-600/20 dark:to-violet-600/5 border border-violet-200 dark:border-violet-500/20 rounded-2xl text-center overflow-hidden"
          >
            <i className="fa-solid fa-book-open text-violet-500 dark:text-violet-400 text-2xl mb-3" />
            <div className="overflow-hidden flex items-center justify-center w-full text-gray-900 dark:text-gray-100 font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              <AnimatedCounter targetNumber={blogCount} fontSize={48} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Blogs Published</p>
          </motion.div>

          {/* Play Store CTA */}
          <motion.a
            href="https://play.google.com/store/apps/details?id=com.im_moin.blogotypo"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            style={{ textDecoration: 'none' }}
            className="flex flex-col items-center justify-center max-md:px-4 max-md:py-3 bg-gradient-to-br from-green-50 to-gray-100 dark:from-green-600/20 dark:to-green-600/5 border border-green-200 dark:border-green-500/20 rounded-2xl text-center group cursor-pointer"
          >
            <i className="fa-brands fa-google-play text-green-500 dark:text-green-400 text-3xl mb-3 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-gray-900 dark:text-gray-100 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Download the App</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Available on Google Play</p>
            <span className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-gray-100 text-xs font-bold rounded-lg transition-colors duration-200">
              <i className="fa-brands fa-google-play text-xs" />
              Get it Free
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default WhyBlogotypo;