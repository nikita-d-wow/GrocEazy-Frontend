import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import {
  fetchAnalyticsProducts,
  deleteProduct as deleteProductAction,
} from '../../redux/actions/productActions';

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

import { Package } from 'lucide-react';
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
  const { analyticsProducts: products, analyticsLoading: loading } =
    useSelector((state: RootState) => state.product);

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
    dispatch(fetchAnalyticsProducts());
  }, [dispatch]);

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-emerald-500/5 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-12 space-y-16">
        {/* HEADER */}
        <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-3xl shadow-sm text-primary border border-gray-100">
              <Package size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Manager Analytics
              </h1>
              <p className="text-gray-500 font-medium">
                Revenue, inventory & product insights
              </p>
            </div>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="relative z-20">
          <AnalyticsCards
            analytics={analytics}
            onDrilldown={(title, productsList, type) =>
              openDrilldown(
                title,
                productsList as AnalyzedProduct[],
                type as 'healthy'
              )
            }
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="cursor-pointer">
            <ChartCard
              title="Revenue Trend"
              description="Monthly growth and financial trajectory"
            >
              <div className="h-[300px] w-full bg-white/20 rounded-3xl p-4">
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
              </div>
            </ChartCard>
          </div>

          <div className="cursor-pointer">
            <ChartCard
              title="Inventory Health"
              description="Stock optimization status"
            >
              <div className="h-[300px] w-full flex items-center justify-center">
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
              </div>
            </ChartCard>
          </div>

          <div className="cursor-pointer">
            <ChartCard
              title="Product Status"
              description="Availability & Catalog coverage"
            >
              <div className="h-[300px] w-full flex items-center justify-center">
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
              </div>
            </ChartCard>
          </div>
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
    </div>
  );
}
