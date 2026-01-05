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
  onSegmentClick,
}: {
  data: InventoryHealthData;
  onSegmentClick?: (_segment: string) => void;
}) {
  const handleClick = (_event: unknown, elements: { index: number }[]) => {
    if (elements.length > 0 && onSegmentClick) {
      const index = elements[0].index;
      const label = ['Healthy', 'Low Stock', 'Out of Stock'][index];
      onSegmentClick(label);
    }
  };

  return (
    <div className="h-[320px] flex items-center justify-center cursor-pointer">
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
        options={{
          ...pieOptions,
          onClick: handleClick,
        }}
      />
    </div>
  );
}
