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
          from { opacity: 0; transform: translateY(20px); }
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

        .bnf-404 {
          font-size: clamp(6rem, 20vw, 10rem);
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, #3D52A0 0%, #7091E6 50%, #3D52A0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite, fadeIn 0.6s ease both;
          letter-spacing: -0.04em;
        }
        .bnf-float {
          animation: floatUp 4s ease-in-out infinite;
        }
        .bnf-fade-1 { animation: fadeIn 0.5s 0.1s ease both; }
        .bnf-fade-2 { animation: fadeIn 0.5s 0.2s ease both; }
        .bnf-fade-3 { animation: fadeIn 0.5s 0.3s ease both; }
        .bnf-fade-4 { animation: fadeIn 0.5s 0.4s ease both; }

        .bnf-ring-outer {
          animation: spin-slow 12s linear infinite;
        }
        .bnf-ring-inner {
          animation: spin-reverse 8s linear infinite;
        }

        .bnf-btn-primary {
          background: #3D52A0;
          color: #EDE8F5;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .bnf-btn-primary:hover {
          background: #7091E6;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(61,82,160,0.35);
        }
        .bnf-btn-ghost {
          background: transparent;
          color: #3D52A0;
          border: 1.5px solid #ADBBDA;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .bnf-btn-ghost:hover {
          background: #EDE8F5;
          border-color: #8697C4;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="relative flex items-center justify-center min-h-[80vh] overflow-hidden bg-theme_1 px-4 py-16">

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-theme_2 opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-theme_4 opacity-20 blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-theme_3 opacity-10 blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

          {/* Animated rings + icon */}
          <div className="relative flex items-center justify-center w-32 h-32 mb-6 bnf-float bnf-fade-1">
            {/* Outer ring */}
            <svg className="absolute inset-0 w-full h-full bnf-ring-outer" viewBox="0 0 128 128" fill="none">
              <circle cx="64" cy="64" r="60" stroke="#ADBBDA" strokeWidth="1.5" strokeDasharray="8 6" />
            </svg>
            {/* Inner ring */}
            <svg className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] bnf-ring-inner" viewBox="0 0 112 112" fill="none">
              <circle cx="56" cy="56" r="52" stroke="#8697C4" strokeWidth="1" strokeDasharray="4 8" />
            </svg>
            {/* Center circle */}
            <div className="w-16 h-16 rounded-full bg-theme_5 flex items-center justify-center shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDE8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="12" y1="9" x2="12.01" y2="9" />
              </svg>
            </div>
          </div>

          {/* 404 */}
          <div className="bnf-404 bnf-fade-1">404</div>

          {/* Divider */}
          <div className="bnf-fade-2 flex items-center gap-3 my-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-theme_2" />
            <div className="w-1.5 h-1.5 rounded-full bg-theme_3" />
            <div className="flex-1 h-px bg-theme_2" />
          </div>

          {/* Title */}
          <h2 className="bnf-fade-2 text-2xl font-bold text-theme_5 mb-2 tracking-tight">
            Blog Not Found
          </h2>

          {/* Description */}
          <p className="bnf-fade-3 text-sm text-theme_3 leading-relaxed mb-8 max-w-sm">
            The post you're looking for doesn't exist, may have been removed,
            or the URL might be incorrect.
          </p>

          {/* Buttons */}
          <div className="bnf-fade-4 flex gap-3 flex-wrap justify-center">
            <Link
              href="/dashboard"
              className="bnf-btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium no-underline"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
              </svg>
              Back to Home
            </Link>

            <button
              onClick={() => router.back()}
              className="bnf-btn-ghost inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Bottom hint */}
          <p className="bnf-fade-4 mt-8 text-xs text-theme_2">
            Error code: <span className="text-theme_3 font-medium">PAGE_NOT_FOUND</span>
          </p>

        </div>
      </div>
    </>
  );
};

export default BlogNotFound;