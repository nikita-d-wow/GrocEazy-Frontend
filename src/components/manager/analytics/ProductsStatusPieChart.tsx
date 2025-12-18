import { Pie } from 'react-chartjs-2';
import { pieOptions } from '../../../utils/chartOptions';
import { pastel } from '../../../utils/colors';

interface ProductStatusData {
  active: number;
  inactive: number;
}

export default function ProductStatusPieChart({
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
              backgroundColor: [pastel.sky, pastel.gray],
              borderWidth: 0,
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
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
