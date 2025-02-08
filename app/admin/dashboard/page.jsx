"use client";

import { useEffect, useState } from "react";
import UserChart from "../_components/UserChart";
import BlogChart from "../_components/BlogChart";
import LineChart from "../_components/LineChart";
import DashboardSkeleton from "../_components/DashSkeleton";
import useMetadata from "@hooks/metadata";


const AdminDashboard = () => {
  // set title for page
  useMetadata('Admin Dashboard - Blogotypo', 'See the graphs of user, blogs data');

  const [userStats, setUserStats] = useState({});
  const [blogStats, setBlogStats] = useState({});
  const [showSkeleton, setShowSkeleton] = useState(true);

  const fetchCount = async () => {
    try {
      const response = await fetch('/api/admin/stats', { method: "GET" });
      if (!response.ok) {
        setShowSkeleton(false);
        return;
      }
      const data = await response.json();
      setUserStats(data.userStats);
      setBlogStats(data.blogStats);
    } catch (error) {
      console.log('error while fetching user & blog count', error);
    } finally {
      setShowSkeleton(false);
    }
  }

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <>
      {showSkeleton
        ? <DashboardSkeleton />
        : <div className="flex flex-col flex-wrap gap-2 md:gap-4">
          <div className="flex flex-wrap">
            <UserChart  {...userStats} />
            <BlogChart {...blogStats} />
          </div>

          <LineChart userStats={userStats} blogStats={blogStats} />
        </div>
      }
    </>
  )
}

export default AdminDashboard
