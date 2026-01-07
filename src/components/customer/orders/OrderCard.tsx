import type { Order } from '../../../redux/types/orderTypes';
import { statusChip } from './OrderConstant';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { ChevronRight, Package } from 'lucide-react';

export default function OrderCard({ order }: { order: Order }) {
  // Access global products to fix missing population
  const allProducts = useSelector((state: RootState) => state.product.products);

  // Helper to get product details (handles unpopulated IDs)
  const getProduct = (item: any) => {
    const id =
      typeof item.productId === 'string' ? item.productId : item.productId?._id;
    return allProducts.find((p) => p._id === id) || item.productId || {};
  };

  // Get first 4 images for thumbnails
  const thumbnails = order.items.slice(0, 4).map((item) => {
    const product = getProduct(item);
    return product.images?.[0] || 'https://via.placeholder.com/150';
  });

  const remainingItems = order.items.length - 4;

  return (
    <Link
      to={`/orders/${order._id}`}
      className={`
        block rounded-3xl p-6 border border-gray-100 bg-white
        shadow-[0_2px_10px_rgba(0,0,0,0.03)] 
        hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        hover:-translate-y-1 transition-all duration-300 
        animate-slideUp cursor-pointer group relative overflow-hidden
      `}
    >
      {/* Status Line */}
      <div
        className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 
        ${
          order.status === 'Delivered'
            ? 'bg-green-500'
            : order.status === 'Cancelled'
              ? 'bg-red-500'
              : 'bg-blue-500'
        }
      `}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 pl-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 tracking-wide uppercase">
              Order #{order._id.slice(-8)}
            </span>
            <span className="text-gray-400 text-xs">
              •{' '}
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">
            ₹
            {Number(order.totalAmount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </h3>
        </div>
        <div className="transform transition-transform group-hover:scale-105">
          {statusChip[order.status] || statusChip['Pending']}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="flex items-center gap-3 mb-6 pl-2">
        {thumbnails.map((src, idx) => (
          <div
            key={idx}
            className="relative w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0"
          >
            <img
              src={src}
              alt="Item"
              className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
        {remainingItems > 0 && (
          <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 font-medium text-xs">
            +{remainingItems}
          </div>
        )}
        {order.items.length === 0 && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Package size={16} /> No items
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50 pl-2">
        <span className="text-sm text-gray-500 font-medium">
          {order.items.reduce((acc, item) => acc + item.quantity, 0)} Items
        </span>
        <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
          View Details <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}
