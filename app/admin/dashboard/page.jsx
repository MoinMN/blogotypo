"use client";

import { useEffect, useState } from "react";
import DashboardSkeleton from "../_components/DashSkeleton";
import useMetadata from "@hooks/metadata";

const STAT_CARDS = (u, b) => [
  {
    label: "Total Users",
    value: u.total ?? 0,
    sub: `+${u.today ?? 0} today`,
    subUp: (u.today ?? 0) >= 0,
    icon: "fa-solid fa-users",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    accent: "border-indigo-500/30",
  },
  {
    label: "Total Blogs",
    value: b.total ?? 0,
    sub: `+${b.today ?? 0} today`,
    subUp: (b.today ?? 0) >= 0,
    icon: "fa-solid fa-book-open",
    iconBg: "bg-violet-100 dark:bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "border-violet-500/30",
  },
  {
    label: "This Month Users",
    value: u.thisMonth ?? 0,
    sub: `vs ${u.lastMonth ?? 0} last month`,
    subUp: (u.thisMonth ?? 0) >= (u.lastMonth ?? 0),
    icon: "fa-solid fa-user-plus",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "border-emerald-500/30",
  },
  {
    label: "This Month Blogs",
    value: b.thisMonth ?? 0,
    sub: `vs ${b.lastMonth ?? 0} last month`,
    subUp: (b.thisMonth ?? 0) >= (b.lastMonth ?? 0),
    icon: "fa-solid fa-pen-nib",
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "border-amber-500/30",
  },
  {
    label: "This Year Users",
    value: u.thisYear ?? 0,
    sub: `vs ${u.lastYear ?? 0} last year`,
    subUp: (u.thisYear ?? 0) >= (u.lastYear ?? 0),
    icon: "fa-solid fa-chart-line",
    iconBg: "bg-sky-100 dark:bg-sky-500/10",
    iconColor: "text-sky-600 dark:text-sky-400",
    accent: "border-sky-500/30",
  },
  {
    label: "This Year Blogs",
    value: b.thisYear ?? 0,
    sub: `vs ${b.lastYear ?? 0} last year`,
    subUp: (b.thisYear ?? 0) >= (b.lastYear ?? 0),
    icon: "fa-solid fa-layer-group",
    iconBg: "bg-rose-100 dark:bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    accent: "border-rose-500/30",
  },
];

const StatCard = ({ label, value, sub, subUp, icon, iconBg, iconColor, accent }) => (
  <div className={`bg-gray-100 dark:bg-[#0f0f22] border border-gray-100 dark:border-gray-100/[0.06] hover:border-opacity-60 ${accent} rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 group`}>
    <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
      <i className={`${icon} ${iconColor} text-base`} />
    </div>
    <div className="min-w-0">
      <p className="text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5 truncate">{label}</p>
      <p className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value.toLocaleString()}
      </p>
      <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${subUp ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
        <i className={`fa-solid ${subUp ? "fa-arrow-trend-up" : "fa-arrow-trend-down"} text-[10px]`} />
        {sub}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  useMetadata("Admin Dashboard - Blogotypo", "See the graphs of user, blogs data");

  const [userStats, setUserStats] = useState({});
  const [blogStats, setBlogStats] = useState({});
  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchCount = async () => {
    try {
      const response = await fetch("/api/admin/stats", { method: "GET" });
      if (!response.ok) { setShowSkeleton(false); return; }
      const data = await response.json();
      setUserStats(data.userStats);
      setBlogStats(data.blogStats);
    } catch (error) {
      console.log("error while fetching user & blog count", error);
    } finally {
      setShowSkeleton(false);
    }
  };

  useEffect(() => { fetchCount(); }, []);

  const cards = STAT_CARDS(userStats, blogStats);

  return (
    <>
      {showSkeleton ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-5 md:gap-6">

          {/* Page header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-px bg-indigo-500" />
              <span className="text-indigo-500 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase">Overview</span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Dashboard
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              Platform analytics and growth metrics
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;