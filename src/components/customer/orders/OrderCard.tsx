import { ChevronRight } from 'lucide-react';
import type { Order } from '../../../redux/types/orderTypes';
import { statusChip, CARD_BG } from './OrderConstant';
import { Link } from 'react-router-dom';

export default function OrderCard({ order }: { order: Order }) {
  // Safely access first item
  const mainItem =
    order.items && order.items.length > 0 ? order.items[0] : null;
  const product = mainItem?.product;

  // We will still render the card even if product/items are missing,
  // just with fallback text, so the user sees the order exists.

  return (
    <div
      className={`
        rounded-3xl p-6 border border-gray-200/50
        shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]
        hover:-translate-y-1 transition-all duration-300 
        animate-slideUp ${CARD_BG}
      `}
    >
      {/* Status + Date */}
      <div className="flex items-center gap-3">
        {statusChip[order.status] || statusChip['Pending']}
        <p className="text-gray-500 text-sm">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Preview card */}
      {/* Preview card content - now wrapped in Link for direct navigation */}
      <Link
        to={`/orders/${order._id}`}
        className="
          mt-6 bg-white/90 shadow-inner rounded-2xl border border-gray-200/40 
          p-5 flex justify-between items-center cursor-pointer
          hover:bg-white transition-all group
        "
      >
        <div className="flex items-center gap-4">
          <img
            src={
              product?.images?.[0] ||
              'https://via.placeholder.com/150?text=No+Image'
            }
            alt={product?.name || 'Product'}
            className="w-20 h-20 rounded-2xl border object-cover shadow-md"
          />
          <div>
            <p className="font-semibold text-gray-900">
              {product?.name || 'Order Items'}
            </p>
            <p className="text-gray-600 text-sm">
              Qty: {mainItem?.quantity || order.items.length || 0}
            </p>
            <p className="font-semibold mt-1 text-gray-800">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>

        <ChevronRight
          size={24}
          className="text-gray-600 transition-all group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
