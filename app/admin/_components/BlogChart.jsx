"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BlogChart = ({ today, yesterday, thisMonth, lastMonth, thisYear, lastYear, total }) => {
  const data = {
    labels: ["Today", "Yesterday", "This Month", "Last Month", "This Year", "Last Year", "Total"],
    datasets: [
      {
        label: "Blogs",
        data: [today, yesterday, thisMonth, lastMonth, thisYear, lastYear, total],
        backgroundColor: ["#2196F3", "#42A5F5", "#64B5F6", "#90CAF9", "#0D47A1", "#0B3D91", "#BBDEFB"],
        borderColor: ["#1976D2", "#1565C0", "#0D47A1", "#0B3D91", "#0A2744", "#081D36", "#A5C9EA"],
        borderWidth: 1,
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
    <div className="w-full md:w-1/2 mx-auto md:p-4 max-md:p-2">
      <h3 className="montserrat_alternates_font text-center font-bold text-lg md:text-2xl lg:text-3xl">
        Blog Statistics
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BlogChart;
