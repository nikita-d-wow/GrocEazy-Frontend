import {
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Package,
} from 'lucide-react';
import type { Product } from '../../../types/Product';
import MetricCard from './MetricCard';

interface AnalyticsData {
  revenue: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  activeProductList: Product[];
}

export default function AnalyticsCards({
  analytics,
  onDrilldown,
}: {
  analytics: AnalyticsData;
  onDrilldown: (_title: string, _products: Product[], _type: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard
        title="Inventory Value"
        value={`₹${analytics.revenue.toLocaleString()}`}
        icon={<IndianRupee />}
        bg="from-violet-500 to-purple-600"
        onClick={() =>
          onDrilldown('Total Inventory', analytics.activeProductList, 'active')
        }
      />
      <MetricCard
        title="Active Products"
        value={analytics.activeProducts}
        icon={<CheckCircle2 />}
        bg="from-blue-500 to-cyan-400"
        onClick={() =>
          onDrilldown('Active Products', analytics.activeProductList, 'active')
        }
      />
      <MetricCard
        title="Low Stock"
        value={analytics.lowStock}
        icon={<AlertTriangle />}
        bg="from-amber-400 to-orange-500"
        productList={analytics.lowStockProducts}
        onClick={() =>
          onDrilldown('Low Stock Products', analytics.lowStockProducts, 'low')
        }
      />
      <MetricCard
        title="Out of Stock"
        value={analytics.outOfStock}
        icon={<Package />}
        bg="from-rose-500 to-red-600"
        productList={analytics.outOfStockProducts}
        onClick={() =>
          onDrilldown(
            'Out of Stock Products',
            analytics.outOfStockProducts,
            'out'
          )
        }
      />
    </div>
  );
}
