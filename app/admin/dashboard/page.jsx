"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardSkeleton from "../../../components/Skeletons/AdminDashSkeleton";
import useMetadata from "@hooks/metadata";

const STAT_CARDS = (u, b) => [
  {
    label: "Total Users",
    value: u.total ?? 0,
    sub: `+${u.today ?? 0} joined today`,
    subUp: (u.today ?? 0) >= 0,
    icon: "fa-solid fa-users",
    iconBg:
      "bg-indigo-200 dark:bg-indigo-500/10",
    iconColor:
      "text-indigo-700 dark:text-indigo-400",
    accent:
      "from-indigo-500/10 to-indigo-500/0",
  },
  {
    label: "Total Blogs",
    value: b.total ?? 0,
    sub: `+${b.today ?? 0} published today`,
    subUp: (b.today ?? 0) >= 0,
    icon: "fa-solid fa-book-open",
    iconBg:
      "bg-violet-200 dark:bg-violet-500/10",
    iconColor:
      "text-violet-700 dark:text-violet-400",
    accent:
      "from-violet-500/10 to-violet-500/0",
  },
  {
    label: "Monthly Users",
    value: u.thisMonth ?? 0,
    sub: `vs ${u.lastMonth ?? 0} last month`,
    subUp:
      (u.thisMonth ?? 0) >=
      (u.lastMonth ?? 0),
    icon: "fa-solid fa-user-plus",
    iconBg:
      "bg-emerald-200 dark:bg-emerald-500/10",
    iconColor:
      "text-emerald-700 dark:text-emerald-400",
    accent:
      "from-emerald-500/10 to-emerald-500/0",
  },
  {
    label: "Monthly Blogs",
    value: b.thisMonth ?? 0,
    sub: `vs ${b.lastMonth ?? 0} last month`,
    subUp:
      (b.thisMonth ?? 0) >=
      (b.lastMonth ?? 0),
    icon: "fa-solid fa-pen-nib",
    iconBg:
      "bg-amber-200 dark:bg-amber-500/10",
    iconColor:
      "text-amber-700 dark:text-amber-400",
    accent:
      "from-amber-500/10 to-amber-500/0",
  },
  {
    label: "Yearly Users",
    value: u.thisYear ?? 0,
    sub: `vs ${u.lastYear ?? 0} last year`,
    subUp:
      (u.thisYear ?? 0) >=
      (u.lastYear ?? 0),
    icon: "fa-solid fa-chart-line",
    iconBg:
      "bg-sky-200 dark:bg-sky-500/10",
    iconColor:
      "text-sky-700 dark:text-sky-400",
    accent:
      "from-sky-500/10 to-sky-500/0",
  },
  {
    label: "Yearly Blogs",
    value: b.thisYear ?? 0,
    sub: `vs ${b.lastYear ?? 0} last year`,
    subUp:
      (b.thisYear ?? 0) >=
      (b.lastYear ?? 0),
    icon: "fa-solid fa-layer-group",
    iconBg:
      "bg-rose-200 dark:bg-rose-500/10",
    iconColor:
      "text-rose-700 dark:text-rose-400",
    accent:
      "from-rose-500/10 to-rose-500/0",
  },
];

const StatCard = ({
  label,
  value,
  sub,
  subUp,
  icon,
  iconBg,
  iconColor,
  accent,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl md:rounded-3xl
        border border-gray-200 dark:border-gray-100/[0.06]
        bg-gray-100 dark:bg-[#0f0f22]
        p-3 md:p-5
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.28)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-300 dark:hover:border-indigo-500/20
        group
      `}
    >
      {/* gradient glow */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-br ${accent}
          transition-all duration-500
        `}
      />

      {/* top blur */}
      <div
        className="
          absolute -top-10 -right-10
          w-24 h-24 rounded-full
          bg-gray-100/30 dark:bg-indigo-500/10
          blur-2xl
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="
              text-[10px] md:text-xs
              uppercase tracking-[0.18em]
              text-gray-500 dark:text-gray-500
              font-semibold
              truncate
            "
          >
            {label}
          </p>

          <h2
            className="
              mt-2
              text-2xl md:text-4xl
              font-bold
              leading-none
              text-gray-900 dark:text-gray-100
            "
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            {value.toLocaleString()}
          </h2>

          <div
            className={`
              mt-3 inline-flex items-center gap-1.5
              text-[11px] md:text-xs
              font-medium
              rounded-full
              px-2 py-1
              ${subUp
                ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
              }
            `}
          >
            <i
              className={`fa-solid ${subUp
                ? "fa-arrow-trend-up"
                : "fa-arrow-trend-down"
                } text-[9px]`}
            />
            <span className="truncate">
              {sub}
            </span>
          </div>
        </div>

        <div
          className={`
            w-11 h-11 md:w-14 md:h-14
            rounded-2xl
            flex items-center justify-center
            flex-shrink-0
            ${iconBg}
            group-hover:scale-110
            transition-all duration-300
          `}
        >
          <i
            className={`${icon} ${iconColor} text-base md:text-xl`}
          />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({
  title,
  desc,
  icon,
  color,
}) => {
  return (
    <button
      className="
        relative overflow-hidden
        rounded-2xl
        border border-gray-200 dark:border-gray-100/[0.06]
        bg-gray-100 dark:bg-[#0f0f22]
        px-4 py-4
        text-left
        transition-all duration-300
        hover:-translate-y-1
        hover:border-gray-300 dark:hover:border-indigo-500/20
        group
      "
    >
      <div
        className="
          absolute inset-0 opacity-0
          group-hover:opacity-100
          transition-all duration-300
          bg-gradient-to-br from-indigo-500/5 to-transparent
        "
      />

      <div className="relative z-10">
        <div
          className={`
            w-10 h-10 rounded-xl
            flex items-center justify-center
            mb-3
            ${color}
          `}
        >
          <i className={`${icon} text-sm`} />
        </div>

        <h3
          className="
            text-sm md:text-base
            font-semibold
            text-gray-900 dark:text-gray-100
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1 text-xs md:text-sm
            leading-relaxed
            text-gray-500 dark:text-gray-400
          "
        >
          {desc}
        </p>
      </div>
    </button>
  );
};

const AdminDashboard = () => {
  useMetadata(
    "Admin Dashboard - Blogotypo",
    "See the graphs of user and blogs data"
  );

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
};

export default AdminDashboard;