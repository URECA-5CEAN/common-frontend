import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  labels: string[];
  data: number[];
  backgroundColors?: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({
  labels,
  data,
  backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'],
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 20,
        top: 0,
        bottom: 0,
      },
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 24,
          boxHeight: 24,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>) {
            const value = context.raw || 0;
            return `${value}회`;
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DonutChart;
