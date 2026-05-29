"use client";

import DashboardSkeleton from "@components/Skeletons/AdminDashSkeleton";
import { useEffect, useMemo, useState } from "react";
import StatCard from "./StatCard";
import STAT_CARDS from "./StatCards";
import QuickActionCard from "./QuickActionCard";

const AdminDashboardPage = () => {
  const [userStats, setUserStats] =
    useState({});

  const [blogStats, setBlogStats] =
    useState({});

  const [showSkeleton, setShowSkeleton] =
    useState(true);

  const fetchCount = async () => {
    try {
      const response = await fetch(
        "/api/admin/stats",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        setShowSkeleton(false);
        return;
      }

      const data = await response.json();

      setUserStats(data.userStats || {});
      setBlogStats(data.blogStats || {});
    } catch (error) {
      console.log(
        "error while fetching stats",
        error
      );
    } finally {
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const cards = useMemo(
    () =>
      STAT_CARDS(userStats, blogStats),
    [userStats, blogStats]
  );

  return (
    <>
      {showSkeleton ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-5 md:gap-7">
          {/* Header */}
          <div
            className="
              relative overflow-hidden
              rounded-3xl
              border border-gray-200 dark:border-gray-100/[0.06]
              bg-gray-100 dark:bg-[#0f0f22]
              px-4 py-5
              md:px-8 md:py-7
            "
          >
            {/* bg glow */}
            <div
              className="
                absolute top-0 right-0
                w-56 h-56
                bg-indigo-300/20 dark:bg-indigo-500/10
                blur-3xl rounded-full
              "
            />

            {/* grid */}
            <div
              className="
                absolute inset-0 opacity-[0.04]
                dark:opacity-[0.03]
                [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
                dark:[background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
                [background-size:24px_24px]
              "
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-px bg-indigo-500" />

                  <span
                    className="
                      text-[11px]
                      uppercase tracking-[0.2em]
                      font-semibold
                      text-indigo-600 dark:text-indigo-400
                    "
                  >
                    Overview
                  </span>
                </div>

                <h1
                  className="
                    text-3xl md:text-5xl
                    font-bold
                    text-gray-900 dark:text-gray-100
                    leading-tight
                  "
                  style={{
                    fontFamily:
                      "'Playfair Display', serif",
                  }}
                >
                  Admin Dashboard
                </h1>

                <p
                  className="
                    mt-2
                    text-sm md:text-base
                    text-gray-500 dark:text-gray-400
                    max-w-2xl
                  "
                >
                  Monitor platform growth,
                  user engagement and
                  publishing activity across
                  Blogotypo.
                </p>
              </div>

              {/* mini insights */}
              <div
                className="
                  grid grid-cols-2 gap-3
                  md:min-w-[320px]
                "
              >
                <div
                  className="
                    rounded-2xl
                    border border-gray-200 dark:border-gray-100/[0.06]
                    bg-gray-200 dark:bg-gray-100/[0.03]
                    px-4 py-3
                  "
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-500">
                    Growth
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                    +24%
                  </h3>
                </div>

                <div
                  className="
                    rounded-2xl
                    border border-gray-200 dark:border-gray-100/[0.06]
                    bg-gray-200 dark:bg-gray-100/[0.03]
                    px-4 py-3
                  "
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-500">
                    Engagement
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                    High
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
              gap-3 md:gap-5
            "
          >
            {cards.map((card) => (
              <StatCard
                key={card.label}
                {...card}
              />
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-px bg-violet-500" />

              <span
                className="
                  text-[11px]
                  uppercase tracking-[0.18em]
                  font-semibold
                  text-violet-600 dark:text-violet-400
                "
              >
                Management
              </span>
            </div>

            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
                gap-3 md:gap-4
              "
            >
              <QuickActionCard
                title="Manage Blogs"
                desc="Review, delete and moderate platform blogs."
                icon="fa-solid fa-book"
                color="bg-violet-200 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"
              />

              <QuickActionCard
                title="Manage Users"
                desc="Control users, creators and permissions."
                icon="fa-solid fa-users-gear"
                color="bg-indigo-200 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
              />

              <QuickActionCard
                title="View Reports"
                desc="Track growth and publishing metrics."
                icon="fa-solid fa-chart-pie"
                color="bg-emerald-200 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              />

              <QuickActionCard
                title="Contact Requests"
                desc="Manage feedback and support messages."
                icon="fa-solid fa-envelope"
                color="bg-amber-200 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboardPage
