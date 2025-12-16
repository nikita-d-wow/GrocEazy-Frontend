export const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } },
    y: { grid: { color: '#e5e7eb' } },
  },
};

export const pieOptions = {
  responsive: true,
  cutout: '60%',
  plugins: {
    legend: { position: 'bottom' as const },
  },
};
