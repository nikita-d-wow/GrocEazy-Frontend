import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  fetchProducts,
  deleteProduct as deleteProductAction,
} from '../../redux/actions/productActions';
import {
  selectProducts,
  selectProductLoading,
} from '../../redux/selectors/productSelectors';

import { buildAnalytics } from '../../utils/analyticsBuilder';

import AnalyticsCards from '../../components/manager/analytics/AnalyticsCards';
import ChartCard from '../../components/manager/analytics/ChartCard';
import RevenueBarChart from '../../utils/wrappers/RevenueBarChartWrapper';
import InventoryPieChart from '../../components/manager/analytics/IneventoryPieChart';
import ProductStatusPieChart from '../../utils/wrappers/ProductStatusPieChartWrapper';
import AnalyticsDrilldownModal from '../../components/manager/analytics/AnalyticsDrilldownModal';
import ProductForm from '../../components/products/ProductForm';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import type { Product } from '../../types/Product';

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

type AnalyzedProduct = Product & { image: string };

interface AnalyticsData {
  revenue: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
  healthyProducts: AnalyzedProduct[];
  lowStockProducts: AnalyzedProduct[];
  outOfStockProducts: AnalyzedProduct[];
  activeProductList: AnalyzedProduct[];
  inactiveProductList: AnalyzedProduct[];
  productsByMonth: Record<string, AnalyzedProduct[]>;
  revenueBar: { labels: string[]; data: number[] };
  productStatus: { active: number; inactive: number };
  inventoryHealth: { healthy: number; low: number; out: number };
}

export default function Analytics() {
  const dispatch = useAppDispatch();
  const productsResult = useSelector(selectProducts);
  const products = (productsResult || []) as Product[];
  const loading = useSelector(selectProductLoading);

  const [drilldown, setDrilldown] = useState<{
    isOpen: boolean;
    title: string;
    products: AnalyzedProduct[];
    type: 'healthy' | 'low' | 'out' | 'active' | 'inactive' | 'revenue';
  }>({
    isOpen: false,
    title: '',
    products: [],
    type: 'healthy',
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const analytics = useMemo(
    () => buildAnalytics(products) as unknown as AnalyticsData,
    [products]
  );

  const openDrilldown = (
    title: string,
    productsList: AnalyzedProduct[],
    type: 'healthy' | 'low' | 'out' | 'active' | 'inactive' | 'revenue'
  ) => {
    setDrilldown({
      isOpen: true,
      title,
      products: productsList,
      type,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
    // Close drilldown modal if it's open
    setDrilldown((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProductAction(id));
        toast.success('Product deleted successfully');
        // Update drilldown if open to reflect deletion
        if (drilldown.isOpen) {
          setDrilldown((prev) => ({
            ...prev,
            products: prev.products.filter((p) => p._id !== id),
          }));
        }
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Analyzing your inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10 space-y-12">
      {/* HEADER */}
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Manager Analytics
        </h1>
        <p className="text-gray-500 mt-1">
          Revenue, inventory & product insights
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="relative z-20">
        <AnalyticsCards
          analytics={analytics}
          onDrilldown={(title, productsList, type) =>
            openDrilldown(title, productsList as AnalyzedProduct[], type as any)
          }
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <ChartCard
          title="Revenue Trend"
          description="Click bars to see products added that month"
        >
          <RevenueBarChart
            data={analytics.revenueBar}
            onSegmentClick={(label) =>
              openDrilldown(
                `Products from ${label}`,
                analytics.productsByMonth[label] || [],
                'revenue'
              )
            }
          />
        </ChartCard>

        <ChartCard
          title="Inventory Health"
          description="Click segments to view product lists"
        >
          <InventoryPieChart
            data={analytics.inventoryHealth}
            onSegmentClick={(segment) => {
              if (segment === 'Healthy') {
                openDrilldown(
                  'Healthy Products',
                  analytics.healthyProducts,
                  'healthy'
                );
              }
              if (segment === 'Low Stock') {
                openDrilldown(
                  'Low Stock Products',
                  analytics.lowStockProducts,
                  'low'
                );
              }
              if (segment === 'Out of Stock') {
                openDrilldown(
                  'Out of Stock Products',
                  analytics.outOfStockProducts,
                  'out'
                );
              }
            }}
          />
        </ChartCard>

        <ChartCard
          title="Product Status"
          description="Click segments to view status details"
        >
          <ProductStatusPieChart
            data={analytics.productStatus}
            onSegmentClick={(segment) => {
              if (segment === 'Active Products') {
                openDrilldown(
                  'Active Products',
                  analytics.activeProductList,
                  'active'
                );
              }
              if (segment === 'Inactive Products') {
                openDrilldown(
                  'Inactive Products',
                  analytics.inactiveProductList,
                  'inactive'
                );
              }
            }}
          />
        </ChartCard>
      </div>

      <AnalyticsDrilldownModal
        isOpen={drilldown.isOpen}
        onClose={() => setDrilldown((prev) => ({ ...prev, isOpen: false }))}
        title={drilldown.title}
        products={drilldown.products}
        type={drilldown.type}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <ProductForm
          key={editingProduct?._id ?? 'new'}
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
