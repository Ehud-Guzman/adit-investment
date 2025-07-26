import React, { useMemo, useState, useEffect } from "react";
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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
  comparisonColor = "#9ca3af",
  className = "",
  loading = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enhanced data validation with fallbacks
  const validatedData = useMemo(() => {
    if (loading) return null;
    
    const defaultData = [5, 10, 6, 15, 20, 12, 8];
    const defaultComparisonData = [4, 8, 5, 12, 18, 10, 7];
    const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // Handle missing data or invalid formats
    if (!data || !Array.isArray(data.signupStats)) {
      return {
        signupStats: defaultData,
        comparisonStats: defaultComparisonData,
        labels: data?.labels || defaultLabels
      };
    }
    
    // Ensure labels match data length
    const labels = data.labels?.length === data.signupStats.length 
      ? data.labels 
      : defaultLabels.slice(0, data.signupStats.length);
    
    return {
      signupStats: data.signupStats,
      comparisonStats: data.comparisonStats || defaultComparisonData,
      labels
    };
  }, [data, loading]);

  // Gradient background for area under line
  const getGradient = (ctx, chartArea) => {
    if (!chartArea) return null;
    
    const gradient = ctx.createLinearGradient(
      0, chartArea.bottom, 
      0, chartArea.top
    );
    gradient.addColorStop(0, `${color}0A`); // 4% opacity
    gradient.addColorStop(1, `${color}33`); // 20% opacity
    return gradient;
  };

  const chartData = useMemo(() => {
    if (!validatedData) return { labels: [], datasets: [] };
    
    return {
      labels: validatedData.labels,
      datasets: [
        {
          label: "Current Week",
          data: validatedData.signupStats,
          borderColor: color,
          backgroundColor: (context) => {
            const chart = context.chart;
            return getGradient(chart.ctx, chart.chartArea);
          },
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
          fill: "origin",
          borderWidth: 3,
        },
        {
          label: "Previous Week",
          data: validatedData.comparisonStats,
          borderColor: comparisonColor,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        }
      ],
    };
  }, [validatedData, color, comparisonColor]);

  const options = useMemo(() => ({
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
            family: "Inter, -apple-system, sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: i === 0 ? `${color}33` : 'transparent',
              strokeStyle: dataset.borderColor,
              lineDash: dataset.borderDash || [],
              lineWidth: 2,
              pointStyle: i === 0 ? 'circle' : 'dash',
              hidden: false
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleFont: {
          size: 14,
          family: "Inter, -apple-system, sans-serif",
          weight: "500"
        },
        bodyFont: {
          size: 13,
          family: "Inter, -apple-system, sans-serif",
        },
        padding: 12,
        usePointStyle: true,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const change = context.datasetIndex === 0 && validatedData?.comparisonStats?.[context.dataIndex] 
              ? value - validatedData.comparisonStats[context.dataIndex] 
              : null;
            
            let changeText = '';
            if (change !== null && !isNaN(change)) {
              const sign = change >= 0 ? '+' : '';
              changeText = ` (${sign}${Math.round(change)})`;
            }
            
            return `${label}: ${value}${changeText}`;
          },
          title: (items) => `Day: ${items[0].label}`
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(229, 231, 235, 0.5)",
          drawTicks: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12
          },
          callback: (value) => value % 5 === 0 ? value : null,
          padding: 10
        },
        border: {
          dash: [4, 4],
          display: false
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
          },
          padding: 5
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: color,
      }
    },
    animation: {
      duration: isMounted ? 1000 : 0,
      easing: 'easeOutQuart'
    }
  }), [color, validatedData, isMounted]);

  if (loading) {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <Skeleton width={180} height={24} />
          <Skeleton width={80} height={16} />
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-3 text-gray-500">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last 7 days
        </div>
      </div>
      
      <div className="h-80">
        <Line 
          data={chartData} 
          options={options}
          aria-label="Weekly user signups chart"
          role="img"
        />
      </div>
      
      <div className="mt-6 flex justify-center text-sm text-gray-500">
        <div className="flex items-center mr-6">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Current Week</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2 relative">
            <div className="absolute inset-0 border-dashed border border-gray-400 rounded-full"></div>
          </div>
          <span>Previous Week</span>
        </div>
      </div>
    </div>
  );
};

DashboardCharts.propTypes = {
  data: PropTypes.shape({
    signupStats: PropTypes.arrayOf(PropTypes.number),
    comparisonStats: PropTypes.arrayOf(PropTypes.number),
    labels: PropTypes.arrayOf(PropTypes.string)
  }),
  title: PropTypes.string,
  color: PropTypes.string,
  comparisonColor: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool
};

DashboardCharts.defaultProps = {
  comparisonColor: "#9ca3af",
  loading: false
};

export default DashboardCharts;