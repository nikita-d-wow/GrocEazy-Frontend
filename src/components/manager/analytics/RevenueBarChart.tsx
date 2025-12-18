import { Bar } from 'react-chartjs-2';
import { barOptions } from '../../../utils/chartOptions';
import { pastel } from '../../../utils/colors';

interface RevenueBarData {
  labels: string[];
  data: number[];
}

export default function RevenueBarChart({ data }: { data: RevenueBarData }) {
  return (
    <div className="h-[360px]">
      <Bar
        data={{
          labels: data.labels,
          datasets: [
            {
              data: data.data,
              backgroundColor: pastel.indigo,
              borderRadius: 10,
              barThickness: 40,
            },
          ],
        }}
        options={barOptions}
      />
    </div>
  );
}
