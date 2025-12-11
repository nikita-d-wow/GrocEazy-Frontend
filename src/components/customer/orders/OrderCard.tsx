import { useState } from 'react';
import { ChevronRight, ChevronUp, Truck } from 'lucide-react';
import type { Order } from '../../../types/Order.jsx';
import { statusChip, CARD_BG } from './OrderConstant.jsx';

export default function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const mainItem = order.items[0];

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
        {statusChip[order.status]}
        <p className="text-gray-500 text-sm">
          {new Date(order.placedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Preview card */}
      <div
        className="
          mt-6 bg-white/90 shadow-inner rounded-2xl border border-gray-200/40 
          p-5 flex justify-between items-center cursor-pointer
          hover:bg-white transition-all
        "
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <img
            src={mainItem.image}
            className="w-20 h-20 rounded-2xl border object-cover shadow-md"
          />
          <div>
            <p className="font-semibold text-gray-900">
              {mainItem.productName}
            </p>
            <p className="text-gray-600 text-sm">Qty: {mainItem.quantity}</p>
            <p className="font-semibold mt-1 text-gray-800">
              ₹{mainItem.lineTotal}
            </p>
          </div>
        </div>

        <ChevronRight
          size={24}
          className={`text-gray-600 transition-all ${open ? 'rotate-90' : ''}`}
        />
      </div>

      {/* Expanded Details */}
      {open && (
        <div
          className="
            mt-4 bg-white/95 rounded-2xl backdrop-blur shadow-md 
            border border-gray-200/40 p-6 space-y-5 animate-fadeIn
          "
        >
          <p className="text-gray-700 text-sm">
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>

          <p className="text-gray-700 text-sm">
            <span className="font-semibold">Total Paid:</span> ₹
            {order.totalAmount}
          </p>

          {/* Item List */}
          <div className="space-y-4 border-t pt-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="
                  flex justify-between items-center p-3 rounded-xl
                  bg-gray-50 hover:bg-gray-100 transition
                  border border-gray-200/40
                "
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-14 h-14 rounded-xl border shadow-sm object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} × ₹{item.unitPrice}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-gray-900">₹{item.lineTotal}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <p className="text-gray-700 text-sm flex items-start gap-2">
            <Truck size={18} className="text-primary mt-1" />
            <span>
              <span className="font-semibold">{order.address.fullName}</span>,{' '}
              {order.address.line1}, {order.address.city}
            </span>
          </p>

          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-primary font-semibold"
          >
            <ChevronUp size={18} /> Hide Details
          </button>
        </div>
      )}
    </div>
  );
}
