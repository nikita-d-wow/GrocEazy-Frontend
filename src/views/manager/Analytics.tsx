import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../redux/store';

import { fetchProducts } from '../../redux/actions/productActions';
import { selectProducts } from '../../redux/selectors/productSelectors';

import { buildAnalytics } from '../../utils/analyticsBuilder';

import AnalyticsCards from '../../components/manager/analytics/AnalyticsCards';
import ChartCard from '../../components/manager/analytics/ChartCard';
import RevenueBarChart from '../../components/manager/analytics/RevenueBarChart';
import InventoryPieChart from '../../components/manager/analytics/IneventoryPieChart';
import ProductStatusPieChart from '../../components/manager/analytics/ProductsStatusPieChart';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const analytics = useMemo(() => buildAnalytics(products), [products]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Manager Analytics
        </h1>
        <p className="text-gray-500 mt-1">
          Revenue, inventory & product insights
        </p>
      </div>

      {/* METRIC CARDS */}
      <AnalyticsCards analytics={analytics} />

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <ChartCard title="Revenue Trend">
          <RevenueBarChart data={analytics.revenueBar} />
        </ChartCard>

        <ChartCard title="Inventory Health">
          <InventoryPieChart data={analytics.inventoryHealth} />
        </ChartCard>

        <ChartCard title="Product Status">
          <ProductStatusPieChart data={analytics.productStatus} />
        </ChartCard>
      </div>
    </div>
  );
}
