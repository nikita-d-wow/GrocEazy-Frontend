import { Bar } from 'react-chartjs-2';
import { barOptions } from '../chartOptions';
import { bright } from '../colors';

interface RevenueBarData {
  labels: string[];
  data: number[];
}

export default function RevenueBarChartWrapper({
  data,
  onSegmentClick,
}: {
  data: RevenueBarData;
  onSegmentClick?: (_label: string) => void;
}) {
  const handleClick = (_event: unknown, elements: { index: number }[]) => {
    if (elements.length > 0 && onSegmentClick) {
      const index = elements[0].index;
      onSegmentClick(data.labels[index]);
    }
  };

  return (
    <div className="h-[320px] cursor-pointer">
      <Bar
        data={{
          labels: data.labels,
          datasets: [
            {
              data: data.data,
              backgroundColor: bright.indigo,
              hoverBackgroundColor: bright.purple,
              borderRadius: 8,
              maxBarThickness: 40,
            },
          ],
        }}
        options={{
          ...barOptions,
          onClick: handleClick,
        }}
      />
    </div>
  );
}
