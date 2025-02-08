"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserChart = ({ today, yesterday, thisMonth, lastMonth, thisYear, lastYear, total }) => {
  const data = {
    labels: ["Today", "Yesterday", "This Month", "Last Month", "This Year", "Last Year", "Total"],
    datasets: [
      {
        label: "Users",
        data: [today, yesterday, thisMonth, lastMonth, thisYear, lastYear, total],
        backgroundColor: ["#4CAF50", "#66BB6A", "#81C784", "#A5D6A7", "#2E7D32", "#145A32", "#C8E6C9"],
        borderColor: ["#388E3C", "#43A047", "#2E7D32", "#1B5E20", "#145A32", "#0D3B24", "#A5D6A7"],
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
    <div className="w-full md:w-1/2 mx-auto md:p-4 max-md:p-2 text-white" >
      <h3 className="montserrat_alternates_font text-center font-bold text-lg md:text-2xl lg:text-3xl">
        User Statistics
      </h3>
      <Bar data={data} options={options} />
    </div >
  );
};

export default UserChart;
