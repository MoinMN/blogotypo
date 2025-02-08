"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ userStats, blogStats }) => {
  const labels = ["Today", "Yesterday", "This Month", "Last Month", "This Year", "Last Year", "Total"];

  const data = {
    labels,
    datasets: [
      {
        label: "Users",
        data: [
          userStats.today,
          userStats.yesterday,
          userStats.thisMonth,
          userStats.lastMonth,
          userStats.thisYear,
          userStats.lastYear,
          userStats.total,
        ],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
      },
      {
        label: "Blogs",
        data: [
          blogStats.today,
          blogStats.yesterday,
          blogStats.thisMonth,
          blogStats.lastMonth,
          blogStats.thisYear,
          blogStats.lastYear,
          blogStats.total,
        ],
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    plugins: { legend: { labels: { color: "white", }, }, },
    scales: {
      x: {
        ticks: { color: "white", },
        grid: { color: "rgba(255, 255, 255, 0.2)", },
      },
      y: {
        ticks: { color: "white", },
        grid: { color: "rgba(255, 255, 255, 0.2)", },
      },
    },
  };

  return (
    <div className="w-full md:w-3/4 mx-auto md:p-4 max-md:p-2">
      <h3 className="montserrat_alternates_font text-center font-bold text-lg md:text-2xl lg:text-3xl">
        Users & Blogs Growth
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
