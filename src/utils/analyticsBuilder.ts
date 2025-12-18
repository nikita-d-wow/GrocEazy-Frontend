import type { Product } from '../types/Product';

export function buildAnalytics(products: Product[]) {
  const active = products.filter((p) => p.isActive && !p.isDeleted);
  const inactive = products.filter((p) => !p.isActive && !p.isDeleted);

  const lowStock = active.filter(
    (p) => p.stock <= p.lowStockThreshold && p.stock > 0
  );
  const outOfStock = active.filter((p) => p.stock === 0);

  const monthlyRevenue: Record<string, number> = {};

  active.forEach((p) => {
    const key = new Date(p.createdAt).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.price * p.stock;
  });

  return {
    revenue: Object.values(monthlyRevenue).reduce((a, b) => a + b, 0),
    activeProducts: active.length,
    lowStock: lowStock.length,
    outOfStock: outOfStock.length,

    revenueBar: {
      labels: Object.keys(monthlyRevenue),
      data: Object.values(monthlyRevenue),
    },

    productStatus: {
      active: active.length,
      inactive: inactive.length,
    },

    inventoryHealth: {
      healthy: active.length - lowStock.length - outOfStock.length,
      low: lowStock.length,
      out: outOfStock.length,
    },
  };
}
