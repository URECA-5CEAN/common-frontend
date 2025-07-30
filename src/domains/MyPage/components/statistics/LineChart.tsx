import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface LineChartProps {
  labels: string[];
  data: number[];
  labelText?: string;
  borderColor?: string;
  backgroundColor?: string;
  options?: ChartOptions<'line'>;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  labels,
  data,
  borderColor = '#4F46E5',
  backgroundColor = 'rgba(79, 70, 229, 0.1)',
  options,
  className,
}) => {
  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        data,
        borderColor,
        backgroundColor,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${value}원`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}원`,
        },
      },
    },
  };

  return (
    <Line
      data={chartData}
      options={{ ...defaultOptions, ...options }}
      className={className}
    />
  );
};

export default LineChart;
