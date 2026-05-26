'use client';

import { useRouter } from '@node_modules/next/navigation';
import Link from 'next/link';
import React from 'react';

const BlogNotFound = () => {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .bnf-404 {
          font-size: clamp(5.5rem, 18vw, 9rem);
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite, fadeIn 0.5s ease both;
          letter-spacing: -0.05em;
          font-family: 'Playfair Display', serif;
        }
        .bnf-float { animation: floatUp 4s ease-in-out infinite; }
        .bnf-fade-1 { animation: fadeIn 0.5s 0.05s ease both; }
        .bnf-fade-2 { animation: fadeIn 0.5s 0.15s ease both; }
        .bnf-fade-3 { animation: fadeIn 0.5s 0.25s ease both; }
        .bnf-fade-4 { animation: fadeIn 0.5s 0.35s ease both; }
        .bnf-ring-outer { animation: spin-slow 14s linear infinite; }
        .bnf-ring-inner { animation: spin-reverse 9s linear infinite; }
        .bnf-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
      `}</style>

      <div className="relative flex items-center justify-center min-h-[85vh] overflow-hidden bg-gray-50 dark:bg-[#0a0a14] px-4 py-16">

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glowing orbs */}
        <div className="bnf-glow absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="bnf-glow absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-400/10 dark:bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

          {/* Animated rings + icon */}
          <div className="relative flex items-center justify-center w-28 h-28 mb-5 bnf-float bnf-fade-1">
            {/* Outer ring */}
            <svg className="absolute inset-0 w-full h-full bnf-ring-outer" viewBox="0 0 112 112" fill="none">
              <circle cx="56" cy="56" r="52" stroke="#6366f1" strokeWidth="1" strokeDasharray="6 5" strokeOpacity="0.3" />
            </svg>
            {/* Inner ring */}
            <svg className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] bnf-ring-inner" viewBox="0 0 88 88" fill="none">
              <circle cx="44" cy="44" r="40" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 7" strokeOpacity="0.4" />
            </svg>
            {/* Center */}
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 dark:bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-300 dark:shadow-[0_0_30px_rgba(99,91,255,0.5)]">
              <i className="fa-solid fa-file-circle-question text-gray-100 text-xl" />
            </div>
          </div>

          {/* 404 number */}
          <div className="bnf-404 bnf-fade-1">404</div>

          {/* Divider */}
          <div className="bnf-fade-2 flex items-center gap-3 my-4 w-full max-w-[240px]">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-100/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500" />
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-100/10" />
          </div>

          {/* Title */}
          <h2
            className="bnf-fade-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Blog Not Found
          </h2>

          {/* Description */}
          <p className="bnf-fade-3 text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-xs">
            The post you're looking for doesn't exist, may have been removed, or the URL might be incorrect.
          </p>

          {/* Buttons */}
          <div className="bnf-fade-4 flex gap-3 flex-wrap justify-center">
            <Link
              href="/dashboard"
              style={{ textDecoration: 'none' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-100 bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-200 dark:shadow-[0_0_20px_rgba(99,91,255,0.35)] hover:shadow-indigo-300 dark:hover:shadow-[0_0_28px_rgba(99,91,255,0.5)] hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-house text-xs" />
              Back to Home
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-100/5 border border-gray-200 dark:border-gray-100/10 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-200 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
              Go Back
            </button>
          </div>

          {/* Error code */}
          <p className="bnf-fade-4 mt-8 text-[11px] text-gray-300 dark:text-gray-600 font-mono tracking-widest uppercase">
            Error · <span className="text-indigo-400 dark:text-indigo-500">PAGE_NOT_FOUND</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default BlogNotFound;