import type { Product } from '../types/Product';

export type MappedProduct = Product & { image: string };

export function buildAnalytics(products: Product[]) {
  const stats = {
    revenue: 0,
    activeProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    healthyProducts: [] as MappedProduct[],
    lowStockProducts: [] as MappedProduct[],
    outOfStockProducts: [] as MappedProduct[],
    activeProductList: [] as MappedProduct[],
    inactiveProductList: [] as MappedProduct[],
    monthlyRevenue: {} as Record<string, number>,
    productsByMonth: {} as Record<string, MappedProduct[]>,
  };

  products.forEach((p) => {
    if (p.isDeleted) {
      return;
    }

    const mappedProduct: MappedProduct = {
      ...p,
      image: p.images?.[0] || '',
    };

    if (!p.isActive) {
      stats.inactiveProductList.push(mappedProduct);
      return;
    }

    // Active products logic
    stats.activeProducts++;
    stats.activeProductList.push(mappedProduct);

    // Grouping by month
    const key = new Date(p.createdAt).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    const productValue = (p.price || 0) * (p.stock || 0);
    stats.revenue += productValue;
    stats.monthlyRevenue[key] = (stats.monthlyRevenue[key] || 0) + productValue;

    if (!stats.productsByMonth[key]) {
      stats.productsByMonth[key] = [];
    }
    stats.productsByMonth[key].push(mappedProduct);

    // Stock Status
    if (p.stock === 0) {
      stats.outOfStockCount++;
      stats.outOfStockProducts.push(mappedProduct);
    } else if (p.stock <= (p.lowStockThreshold || 5)) {
      stats.lowStockCount++;
      stats.lowStockProducts.push(mappedProduct);
    } else {
      stats.healthyProducts.push(mappedProduct);
    }
  });

  return {
    revenue: stats.revenue,
    activeProducts: stats.activeProducts,
    lowStock: stats.lowStockCount,
    outOfStock: stats.outOfStockCount,

    // Product Lists
    healthyProducts: stats.healthyProducts,
    lowStockProducts: stats.lowStockProducts,
    outOfStockProducts: stats.outOfStockProducts,
    activeProductList: stats.activeProductList,
    inactiveProductList: stats.inactiveProductList,
    productsByMonth: stats.productsByMonth,

    revenueBar: {
      labels: Object.keys(stats.monthlyRevenue),
      data: Object.values(stats.monthlyRevenue),
    },

    productStatus: {
      active: stats.activeProducts,
      inactive: stats.inactiveProductList.length,
    },

    inventoryHealth: {
      healthy: stats.healthyProducts.length,
      low: stats.lowStockCount,
      out: stats.outOfStockCount,
    },
  };
}
