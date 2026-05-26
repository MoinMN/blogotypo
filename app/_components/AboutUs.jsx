"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutUs = () => {
  const skills = ["Next.js", "React.js", "Node.js", "MongoDB", "Express.js", "Tailwind CSS", "Redux", "REST APIs", "React Native", "Git"];

  const highlights = [
    {
      icon: "fa-solid fa-code", color: "text-indigo-500 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
      title: "Full Stack Developer", desc: "Building end-to-end web experiences with the MERN stack and Next.js.",
    },
    {
      icon: "fa-solid fa-mobile-screen-button", color: "text-violet-500 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20",
      title: "Mobile Developer", desc: "Crafting cross-platform mobile apps with React Native for Android.",
    },
    {
      icon: "fa-solid fa-globe", color: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
      title: "Open Source", desc: "Blogotypo is fully open and free — no paywalls, no ads, ever.",
    },
  ];

  return (
    <section id="about" className="bg-gray-50 dark:bg-[#0d0d1a] scroll-mt-20 p-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">

        {/* Label */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-indigo-500" />
          <span className="text-indigo-500 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase">About</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-12 md:mb-16 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Built by a developer,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">for creators.</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left — Bio */}
          <div>
            {/* Avatar + Name */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6 }} className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-indigo-200 dark:ring-indigo-500/30 flex-shrink-0">
                <Image src="/assets/images/avatar.jpg" fill alt="Moin Naik" className="object-cover" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Moin Naik</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Full Stack & Mobile Developer</p>
                <Link href="https://www.linkedin.com/in/moinnaik/" target="_blank" style={{ textDecoration: 'none' }} className="inline-flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-medium mt-0.5">
                  <i className="fa-brands fa-linkedin text-sm" />
                  linkedin.com/in/moinnaik
                </Link>
              </div>
            </motion.div>

            {/* Bio text */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.15 }} className="space-y-4 text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8">
              <p>
                Hi, I'm <span className="text-gray-900 dark:text-gray-100 font-semibold">Moin MN</span> — a passionate MERN Stack & Next.js developer from India, dedicated to building seamless and engaging web experiences.
              </p>
              <p>
                I created <span className="text-indigo-600 dark:text-indigo-300 font-medium">Blogotypo</span> as a platform where anyone can share knowledge, ideas, and stories with the world — without fees, without ads, without barriers. It's available both as a web app and on the{" "}
                <a href="https://play.google.com/store/apps/details?id=com.im_moin.blogotypo" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 font-medium transition-colors">
                  Google Play Store
                </a>.
              </p>
              <p>I care about clean code, great UX, and building things that actually matter to people.</p>
            </motion.div>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-50/5 border border-gray-200 dark:border-gray-100/10 hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-300 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full transition-all duration-200 cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.4 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap gap-3 mt-8">
              {[
                { href: "https://www.moinnaik.in/", icon: "fa-solid fa-globe", color: "text-indigo-500 dark:text-indigo-400", label: "Portfolio", external: true },
                { href: "https://play.google.com/store/apps/details?id=com.im_moin.blogotypo", icon: "fa-brands fa-google-play", color: "text-green-500 dark:text-green-400", label: "Play Store", external: true },
                { href: "https://github.com/MoinMN", icon: "fa-brands fa-github", color: "text-gray-700 dark:text-gray-300", label: "GitHub", external: true },
              ].map(({ href, icon, color, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-50/5 hover:bg-gray-100 dark:hover:bg-gray-50/10 border border-gray-200 dark:border-gray-100/10 hover:border-gray-300 dark:hover:border-gray-100/20 text-gray-700 dark:text-gray-100 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  <i className={`${icon} ${color} text-xs`} />
                  {label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — Highlight cards */}
          <div className="flex flex-col gap-4">
            {highlights.map(({ icon, color, bg, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.55, delay: i * 0.12 }}
                className={`flex items-start gap-2 md:gap-4 max-md:px-3 max-md:py-2 md:px-5 md:py-4 bg-gray-50 dark:bg-gray-50/[0.03] border ${bg} rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-50/[0.06] transition-all duration-300 group`}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${icon} ${color} text-base`} />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-base mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 border-l-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-500/5 rounded-r-2xl mt-2"
            >
              <p className="text-gray-600 dark:text-gray-300 text-base italic leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                "Every great developer started with a single line of code. Blogotypo exists so every great writer can start with a single published post."
              </p>
              <p className="text-indigo-500 dark:text-indigo-400 text-sm font-semibold mt-3">— Moin MN, Creator</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;