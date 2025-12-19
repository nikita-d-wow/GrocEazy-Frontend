import { Pie } from 'react-chartjs-2';
import { pieOptions } from '../chartOptions';
import { bright } from '../colors';

interface ProductStatusData {
  active: number;
  inactive: number;
}

export default function ProductStatusPieChartWrapper({
  data,
}: {
  data: ProductStatusData;
}) {
  return (
    <div className="h-[320px] flex items-center justify-center">
      <Pie
        data={{
          labels: ['Active Products', 'Inactive Products'],
          datasets: [
            {
              data: [data.active, data.inactive],
              backgroundColor: [bright.emerald, bright.rose],
              hoverBackgroundColor: [bright.cyan, bright.pink],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        }}
        options={{
          ...pieOptions,
          plugins: {
            ...pieOptions.plugins,
            legend: {
              position: 'bottom',
              labels: {
                padding: 18,
                font: {
                  size: 12,
                  weight: 600,
                  family: 'Outfit, sans-serif',
                },
                usePointStyle: true,
              },
            },
          },
        }}
      />
    </div>
  );
}
