import type { Order } from '../../../redux/types/orderTypes';
import { statusChip, CARD_BG } from './OrderConstant';
import { Link } from 'react-router-dom';

export default function OrderCard({ order }: { order: Order }) {
  // Safely access first item, but don't fail if missing
  const mainItem =
    order.items && order.items.length > 0 ? order.items[0] : null;
  const product = mainItem?.product;

  return (
    <Link
      to={`/orders/${order._id}`}
      className={`
        block rounded-3xl p-6 border border-gray-200/50
        shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]
        hover:-translate-y-1 transition-all duration-300 
        animate-slideUp ${CARD_BG} cursor-pointer group
      `}
    >
      {/* Status + Date */}
      <div className="flex items-center gap-3">
        {statusChip[order.status] || statusChip['Pending']}
        <p className="text-gray-500 text-sm">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Preview Content */}
      <div className="mt-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
          {product?.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400 text-center px-1">
              No Image
            </span>
          )}
        </div>

        <div>
          <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {product?.name || 'Product Information Unavailable'}
          </p>
          {mainItem ? (
            <>
              <p className="text-gray-600 text-sm">Qty: {mainItem.quantity}</p>
              <p className="font-semibold mt-1 text-gray-800">
                ₹{mainItem.unitPrice * mainItem.quantity}
              </p>
            </>
          ) : (
            <p className="text-red-400 text-sm mt-1">Item details missing</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
        <p className="text-gray-500">
          Total:{' '}
          <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
        </p>
        <span className="text-primary font-medium group-hover:underline">
          View Details →
        </span>
      </div>
    </Link>
  );
}
