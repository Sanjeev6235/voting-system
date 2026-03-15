import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = [
  '#6366f1', '#f97316', '#10b981', '#f59e0b', '#3b82f6',
  '#ec4899', '#14b8a6', '#8b5cf6', '#ef4444', '#84cc16',
];

export default function ResultChart({ results, title }) {
  const [chartType, setChartType] = useState('bar');

  if (!results || results.length === 0) return null;

  const labels = results.map((r) => r.name);
  const data = results.map((r) => r.voteCount);
  const colors = results.map((_, i) => COLORS[i % COLORS.length]);

  const pieData = {
    labels,
    datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#ffffff' }],
  };

  const barData = {
    labels,
    datasets: [{
      label: 'Votes',
      data,
      backgroundColor: colors,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(148,163,184,0.1)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } },
    },
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-slate-900 dark:text-white">{title || 'Vote Distribution'}</h3>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          {['bar', 'pie'].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartType === type
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {chartType === 'bar' ? (
          <Bar data={barData} options={barOptions} />
        ) : (
          <Pie data={pieData} options={pieOptions} />
        )}
      </div>
    </div>
  );
}
