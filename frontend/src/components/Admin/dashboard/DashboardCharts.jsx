import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const DashboardCharts = ({ 
  data, 
  title = "📈 Weekly User Signups",
  color = "#3b82f6",
  className = ""
}) => {
  // Enhanced data validation with fallbacks
  const validatedData = useMemo(() => {
    const defaultData = [5, 10, 6, 15, 20, 12, 8];
    const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // Handle missing data or invalid formats
    if (!data || !Array.isArray(data.signupStats)) {
      return {
        signupStats: defaultData,
        labels: data?.labels || defaultLabels
      };
    }
    
    // Ensure labels match data length
    const labels = data.labels?.length === data.signupStats.length 
      ? data.labels 
      : defaultLabels.slice(0, data.signupStats.length);
    
    return {
      signupStats: data.signupStats,
      labels
    };
  }, [data]);

  // Gradient background for area under line
  const getGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `${color}33`); // 20% opacity
    gradient.addColorStop(1, `${color}03`); // 1% opacity
    return gradient;
  };

  const chartData = {
    labels: validatedData.labels,
    datasets: [
      {
        label: "User Signups",
        data: validatedData.signupStats,
        borderColor: color,
        backgroundColor: (context) => getGradient(context.chart.ctx),
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 2,
        fill: "origin",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#374151",
          font: {
            size: 13,
            family: "Inter, sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleFont: {
          size: 14,
          family: "Inter, sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "Inter, sans-serif",
        },
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y}`,
          title: (items) => `Day: ${items[0].label}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12
          },
          callback: (value) => value % 5 === 0 ? value : null
        },
        border: {
          dash: [4, 4],
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
            weight: "500"
          }
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: color,
      }
    }
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-sm text-gray-500">
          Last 7 days
        </div>
      </div>
      
      <div className="h-80">
        <Line 
          data={chartData} 
          options={options} 
          aria-label="Weekly user signups chart"
        />
      </div>
      
      <div className="mt-4 flex justify-center text-sm text-gray-500">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Current Week</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
          <span>Previous Week</span>
        </div>
      </div>
    </div>
  );
};

DashboardCharts.propTypes = {
  data: PropTypes.shape({
    signupStats: PropTypes.arrayOf(PropTypes.number),
    labels: PropTypes.arrayOf(PropTypes.string)
  }),
  title: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string
};

export default DashboardCharts;