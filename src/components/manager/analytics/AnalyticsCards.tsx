import {
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Package,
} from 'lucide-react';
import MetricCard from './MetricCard';

interface AnalyticsData {
  revenue: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
}

export default function AnalyticsCards({
  analytics,
}: {
  analytics: AnalyticsData;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Inventory Value"
        value={`₹${analytics.revenue.toLocaleString()}`}
        icon={<IndianRupee />}
        bg="from-indigo-100 to-indigo-200"
      />
      <MetricCard
        title="Active Products"
        value={analytics.activeProducts}
        icon={<CheckCircle2 />}
        bg="from-sky-100 to-sky-200"
      />
      <MetricCard
        title="Low Stock"
        value={analytics.lowStock}
        icon={<AlertTriangle />}
        bg="from-amber-100 to-amber-200"
      />
      <MetricCard
        title="Out of Stock"
        value={analytics.outOfStock}
        icon={<Package />}
        bg="from-rose-100 to-rose-200"
      />
    </div>
  );
}
