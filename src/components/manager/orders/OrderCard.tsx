import OrderStatusSelect from './OrderStatusSelect';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, IndianRupee, Hash } from 'lucide-react';

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
        bg-white/70 backdrop-blur-xl border border-white/60
        rounded-2xl p-4 sm:p-6
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 cursor-pointer
        group relative
      "
    >
      {/* Decorative Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* LEFT SECTION: User & ID */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <Package size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2">
              {customerName}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono border border-gray-200 uppercase">
                <Hash size={10} /> {order._id.slice(-8)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-primary/60" />
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Minimal Stats */}
        <div className="flex items-center gap-8 lg:gap-12">
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              Items
            </p>
            <p className="text-sm font-bold text-gray-700">
              {order.items?.length || 0} units
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">
              Total Amount
            </p>
            <p className="text-xl font-black text-primary flex items-center">
              <IndianRupee size={16} className="mt-0.5" />
              {Number(order.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION: Status Select */}
        <div className="flex-shrink-0">
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
