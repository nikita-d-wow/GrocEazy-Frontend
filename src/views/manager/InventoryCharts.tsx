import type { FC } from 'react';
import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Product } from '../../types/Product';
import type { Category } from '../../types/Category';

interface InventoryChartsProps {
  products: Product[];
  categories: Category[];
}

const STATUS_COLORS = {
  inStock: '#16a34a', // green-600
  lowStock: '#ea580c', // orange-600
  outOfStock: '#dc2626', // red-600
};

const CustomXAxisTick = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: { value: string };
}) => {
  const words = payload.value.split(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={25} textAnchor="middle" fill="#666" fontSize={12}>
        {words.map((word, index) => (
          <tspan key={index} x={0} dy={index === 0 ? 0 : 12}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export const InventoryCharts: FC<InventoryChartsProps> = ({
  products,
  categories,
}) => {
  // 1. Stock Status Distribution (Pie Chart)
  const stockData = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach((p) => {
      const threshold = p.lowStockThreshold || 5;
      if (p.stock <= 0) {
        outOfStock++;
      } else if (p.stock <= threshold) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    return [
      { name: 'In Stock', value: inStock, color: STATUS_COLORS.inStock },
      { name: 'Low Stock', value: lowStock, color: STATUS_COLORS.lowStock },
      {
        name: 'Out of Stock',
        value: outOfStock,
        color: STATUS_COLORS.outOfStock,
      },
    ].filter((d) => d.value > 0);
  }, [products]);

  // 2. Category Distribution (Bar Chart)
  const categoryData = useMemo(() => {
    const data = categories.map((cat) => {
      const catProducts = products.filter((p) => {
        let pCatId;
        // Check categoryId object/string
        if (typeof p.categoryId === 'object' && p.categoryId) {
          pCatId = (p.categoryId as any)._id;
        } else if (p.categoryId) {
          pCatId = p.categoryId;
        }
        // fallback to category field
        else if (typeof p.category === 'object' && p.category) {
          pCatId = (p.category as any)._id;
        } else {
          pCatId = p.category;
        }

        return pCatId === cat._id;
      });
      const totalStock = catProducts.reduce((acc, p) => acc + p.stock, 0);
      return {
        name: cat.name,
        stock: totalStock,
        count: catProducts.length,
      };
    });
    // Sort by stock desc and take top 8
    return data.sort((a, b) => b.stock - a.stock).slice(0, 8);
  }, [products, categories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Stock Status Pie Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Overview</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Stock Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Stock by Category (Top 8)
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 10, right: 10, left: -20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                interval={0}
                tick={<CustomXAxisTick x={0} y={0} payload={{ value: '' }} />}
                axisLine={false}
                tickLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar
                dataKey="stock"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                name="Total Items"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
