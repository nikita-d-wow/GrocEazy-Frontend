export const getBarOptions = (isDarkMode: boolean = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 12,
        autoSkip: false,
        color: isDarkMode
          ? 'rgba(148, 163, 184, 0.8)'
          : 'rgba(100, 116, 139, 0.8)',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(156, 163, 175, 0.1)',
      },
      ticks: {
        color: isDarkMode
          ? 'rgba(148, 163, 184, 0.8)'
          : 'rgba(100, 116, 139, 0.8)',
      },
    },
  },
});

export const getPieOptions = (isDarkMode: boolean = false) => ({
  responsive: true,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: isDarkMode
          ? 'rgba(226, 232, 240, 0.8)'
          : 'rgba(100, 116, 139, 0.8)',
        font: {
          weight: 'bold' as const,
          size: 11,
        },
        padding: 20,
        usePointStyle: true,
      },
    },
  },
});

// Legacy exports for backward compatibility
export const barOptions = getBarOptions(false);
export const pieOptions = getPieOptions(false);
