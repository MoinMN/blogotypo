"use client";

import { motion } from "framer-motion";

const Features = () => {
  const featuresList = [
    { header: "Rich Blog Editor", content: "Write and format your blogs with a powerful rich-text editor supporting images, embeds, and custom styling.", icon: "fa-solid fa-pen-nib", light: "bg-indigo-50 border-indigo-200 text-indigo-600", dark: "dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400", grad: "dark:from-indigo-600/20 dark:to-indigo-600/5 from-indigo-50 to-gray-100" },
    { header: "Reader Reviews & Ratings", content: "Engage your audience with a star-rating and review system. Build credibility through genuine reader feedback.", icon: "fa-solid fa-star-half-stroke", light: "bg-amber-50 border-amber-200 text-amber-600", dark: "dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400", grad: "dark:from-amber-600/20 dark:to-amber-600/5 from-amber-50 to-gray-100" },
    { header: "Social Sharing", content: "Share your posts instantly to WhatsApp, Twitter, LinkedIn, Facebook, and more with a single click.", icon: "fa-solid fa-share-nodes", light: "bg-sky-50 border-sky-200 text-sky-600", dark: "dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400", grad: "dark:from-sky-600/20 dark:to-sky-600/5 from-sky-50 to-gray-100" },
    { header: "Verified Creators", content: "Top creators get a verified badge, giving your best writers the recognition they deserve on the platform.", icon: "fa-solid fa-certificate", light: "bg-violet-50 border-violet-200 text-violet-600", dark: "dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400", grad: "dark:from-violet-600/20 dark:to-violet-600/5 from-violet-50 to-gray-100" },
    { header: "Blog Discovery", content: "Trending, latest, top-rated, and related posts surfaces the right content for every reader automatically.", icon: "fa-solid fa-compass", light: "bg-emerald-50 border-emerald-200 text-emerald-600", dark: "dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400", grad: "dark:from-emerald-600/20 dark:to-emerald-600/5 from-emerald-50 to-gray-100" },
    { header: "Mobile App", content: "Available on the Google Play Store. Blog and read on the go with the native Android app.", icon: "fa-brands fa-google-play", light: "bg-green-50 border-green-200 text-green-600", dark: "dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400", grad: "dark:from-green-600/20 dark:to-green-600/5 from-green-50 to-gray-100" },
    { header: "Creator Dashboard", content: "Manage all your blogs, reviews, and account details from a clean, intuitive personal dashboard.", icon: "fa-solid fa-gauge-high", light: "bg-pink-50 border-pink-200 text-pink-600", dark: "dark:bg-pink-500/10 dark:border-pink-500/20 dark:text-pink-400", grad: "dark:from-pink-600/20 dark:to-pink-600/5 from-pink-50 to-gray-100" },
    { header: "100% Free", content: "No subscriptions, no paywalls, no ads. Blogotypo is completely free to use — forever.", icon: "fa-solid fa-hand-holding-heart", light: "bg-rose-50 border-rose-200 text-rose-600", dark: "dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400", grad: "dark:from-rose-600/20 dark:to-rose-600/5 from-rose-50 to-gray-100" },
  ];

  return (
    <section id="features" className="bg-gray-50 dark:bg-[#0a0a14] scroll-mt-20 max-md:px-4 overflow-hidden py-4 select-none">
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-violet-500" />
          <span className="text-violet-500 dark:text-violet-400 text-xs font-semibold tracking-widest uppercase">Features</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Everything you need<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 dark:from-violet-400 dark:to-indigo-400">to blog confidently.</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-500 dark:text-gray-400 text-base md:text-lg mb-12 max-w-xl">
          Blogotypo packs the tools that matter — and strips away everything that doesn't.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuresList.map((feature, index) => (
            <motion.div
              key={feature.header}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ y: -4 }}
              className={`group flex flex-col max-md:gap-2 md:gap-4 max-md:px-3 max-md:py-2 md:p-4 bg-gradient-to-b ${feature.grad} border ${feature.light} ${feature.dark} rounded-2xl hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl ${feature.light} ${feature.dark} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${feature.icon} ${feature.light.split(' ').find(c => c.startsWith('text-'))} ${feature.dark.split(' ').find(c => c.startsWith('dark:text-'))} text-lg`} />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{feature.header}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{feature.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;