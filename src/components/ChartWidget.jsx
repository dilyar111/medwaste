import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartWidget = ({ title, data, options }) => {
  return (
    <div className="chart-widget">
      <h3>{title}</h3>
      {data && options ? (
        <Line data={data} options={options} />
      ) : (
        <p>No chart data available.</p>
      )}
    </div>
  );
};

export default ChartWidget;