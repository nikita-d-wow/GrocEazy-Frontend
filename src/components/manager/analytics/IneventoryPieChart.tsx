import { Pie } from 'react-chartjs-2';
import { pieOptions } from '../../../utils/chartOptions';
import { pastel } from '../../../utils/colors';

interface InventoryHealthData {
  healthy: number;
  low: number;
  out: number;
}

export default function InventoryPieChart({
  data,
}: {
  data: InventoryHealthData;
}) {
  return (
    <div className="h-[320px] flex items-center justify-center">
      <Pie
        data={{
          labels: ['Healthy', 'Low Stock', 'Out of Stock'],
          datasets: [
            {
              data: [data.healthy, data.low, data.out],
              backgroundColor: [pastel.emerald, pastel.amber, pastel.rose],
              borderWidth: 0,
            },
          ],
        }}
        options={pieOptions}
      />
    </div>
  );
}
