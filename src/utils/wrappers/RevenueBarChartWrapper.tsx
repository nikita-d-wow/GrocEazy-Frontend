import { Bar } from 'react-chartjs-2';
import { barOptions } from '../chartOptions';
import { bright } from '../colors';

interface RevenueBarData {
  labels: string[];
  data: number[];
}

export default function RevenueBarChartWrapper({
  data,
}: {
  data: RevenueBarData;
}) {
  return (
    <div className="h-[360px]">
      <Bar
        data={{
          labels: data.labels,
          datasets: [
            {
              data: data.data,
              backgroundColor: bright.indigo,
              hoverBackgroundColor: bright.purple,
              borderRadius: 8,
              barThickness: 40,
            },
          ],
        }}
        options={barOptions}
      />
    </div>
  );
}
