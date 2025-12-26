import type { Order } from '../../../redux/types/orderTypes';
import { statusChip, CARD_BG } from './OrderConstant';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';

export default function OrderCard({ order }: { order: Order }) {
  // Access global products to fix missing population
  const allProducts = useSelector((state: RootState) => state.product.products);

  // Helper to get product details (handles unpopulated IDs)
  const getProduct = (item: any) => {
    const id =
      typeof item.productId === 'string' ? item.productId : item.productId?._id;
    return allProducts.find((p) => p._id === id) || item.productId || {};
  };

  return (
    <Link
      to={`/orders/${order._id}`}
      className={`
        block rounded-3xl p-6 border border-gray-200/50
        shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]
        hover:-translate-y-1 transition-all duration-300 
        animate-slideUp ${CARD_BG} cursor-pointer group relative overflow-hidden
      `}
    >
      {/* GrocEazy Brand Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="font-bold text-primary text-xl">G</span>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 leading-none">GrocEazy</h3>
          <span className="text-xs text-gray-500">Order #{order._id}</span>
        </div>
        <div className="ml-auto">
          {statusChip[order.status] || statusChip['Pending']}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-6">
        {order.items.slice(0, 4).map((item, idx) => {
          const product = getProduct(item);
          const name = product.name || 'Unknown Item';
          return (
            <div
              key={idx}
              className="flex items-center text-sm group-hover:bg-gray-50/50 p-1 rounded transition-colors"
            >
              <span className="font-medium text-gray-700 truncate max-w-[200px]">
                {name}
              </span>
              <span className="text-gray-500 whitespace-nowrap font-medium ml-1">
                * {item.quantity}
              </span>
            </div>
          );
        })}
        {order.items.length > 4 && (
          <p className="text-xs text-gray-400 pl-1">
            + {order.items.length - 4} more items...
          </p>
        )}
      </div>

      {/* Footer: Date & Total */}
      <div className="flex justify-between items-center text-sm pt-2">
        <span className="text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
        <div className="text-right">
          <span className="text-xs text-gray-400 block mb-0.5">
            Total Amount
          </span>
          <span className="font-bold text-gray-900 text-lg">
            ₹{Number(order.totalAmount).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
