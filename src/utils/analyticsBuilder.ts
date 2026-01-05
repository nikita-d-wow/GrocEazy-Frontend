import type { Product } from '../types/Product';

export function buildAnalytics(products: Product[]) {
  const active = products.filter((p) => p.isActive && !p.isDeleted);
  const inactive = products.filter((p) => !p.isActive && !p.isDeleted);

  const healthy = active.filter(
    (p) => p.stock > p.lowStockThreshold && p.stock > 0
  );
  const lowStock = active.filter(
    (p) => p.stock <= p.lowStockThreshold && p.stock > 0
  );
  const outOfStock = active.filter((p) => p.stock === 0);

  const monthlyRevenue: Record<string, number> = {};
  const productsByMonth: Record<string, Product[]> = {};

  active.forEach((p) => {
    const key = new Date(p.createdAt).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.price * p.stock;
    if (!productsByMonth[key]) {
      productsByMonth[key] = [];
    }
    productsByMonth[key].push(p);
  });

  const mapProduct = (p: Product) => ({
    ...p,
    image: p.images[0],
  });

  return {
    revenue: Object.values(monthlyRevenue).reduce((a, b) => a + b, 0),
    activeProducts: active.length,
    lowStock: lowStock.length,
    outOfStock: outOfStock.length,

    // Product Lists for Drill-down
    healthyProducts: healthy.map(mapProduct),
    lowStockProducts: lowStock.map(mapProduct),
    outOfStockProducts: outOfStock.map(mapProduct),
    activeProductList: active.map(mapProduct),
    inactiveProductList: inactive.map(mapProduct),
    productsByMonth: Object.keys(productsByMonth).reduce(
      (acc, key) => ({
        ...acc,
        [key]: productsByMonth[key].map(mapProduct),
      }),
      {}
    ),

    revenueBar: {
      labels: Object.keys(monthlyRevenue),
      data: Object.values(monthlyRevenue),
    },

    productStatus: {
      active: active.length,
      inactive: inactive.length,
    },

    inventoryHealth: {
      healthy: healthy.length,
      low: lowStock.length,
      out: outOfStock.length,
    },
  };
}
