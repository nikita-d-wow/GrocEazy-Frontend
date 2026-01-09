import OrderStatusSelect from './OrderStatusSelect';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, IndianRupee, Hash, ArrowRight } from 'lucide-react';

interface Props {
  order: any;
  onStatusChange: (id: string, status: string) => void;
}

const OrderCard = ({ order, onStatusChange }: Props) => {
  const navigate = useNavigate();
  const customerName = order.userId?.name ?? 'Guest User';

  return (
    <div
      onClick={(e) => {
        if (
          (e.target as HTMLElement).closest('button') ||
          (e.target as HTMLElement).closest('select')
        ) {
          return;
        }
        navigate(`/manager/orders/${order._id}`);
      }}
      className="
        relative bg-white border border-gray-100
        rounded-2xl p-5 sm:p-6
        hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200
        hover:-translate-y-0.5
        transition-all duration-300 cursor-pointer
        group overflow-hidden
      "
    >
      {/* Decorative Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Subtle Border Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-green-200" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* LEFT SECTION: User & ID */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center flex-shrink-0 text-green-700 group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-200/50 transition-all duration-300">
            <Package size={24} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                {customerName}
              </h3>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium flex-wrap">
              <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg text-[10px] font-mono border border-gray-200 uppercase tracking-wide">
                <Hash size={10} /> {order._id.slice(-8)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-green-600" />
                <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Stats */}
        <div className="flex items-center gap-8 lg:gap-12">
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
              Items
            </p>
            <p className="text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
              {order.items?.length || 0}{' '}
              {order.items?.length === 1 ? 'unit' : 'units'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
              Total Amount
            </p>
            <p className="text-2xl font-black text-green-700 flex items-center group-hover:text-green-600 transition-colors">
              <IndianRupee size={18} className="mt-0.5" strokeWidth={3} />
              {Number(order.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION: Status Select */}
        <div className="flex-shrink-0 lg:ml-4">
          <OrderStatusSelect
            status={order.status}
            disabled={
              order.status === 'Delivered' || order.status === 'Cancelled'
            }
            onChange={(status) => onStatusChange(order._id, status)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
