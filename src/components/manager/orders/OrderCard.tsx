import OrderStatusSelect from './OrderStatusSelect';

interface Props {
  order: any;
  onStatusChange: (id: string, status: string) => void;
}

const OrderCard = ({ order, onStatusChange }: Props) => {
  const customerName = order.userId?.name ?? 'Guest User';
  const customerEmail = order.userId?.email ?? '—';

  return (
    <div className="glass-card overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
      <div className="p-6 md:p-10 space-y-8">
        {/* USER + STATUS */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary">
                {customerName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {customerName}
              </p>
              <p className="text-sm font-medium text-gray-500">
                {customerEmail}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                <span>
                  {order.address.city}, {order.address.state}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span>{order.address.phone}</span>
              </div>
            </div>
          </div>

          <div className="self-start lg:self-center">
            <OrderStatusSelect
              status={order.status}
              disabled={order.status === 'Delivered'}
              onChange={(status) => onStatusChange(order._id, status)}
            />
          </div>
        </div>

        {/* META GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 rounded-2xl bg-black/5 border border-white/20">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              Order ID
            </p>
            <p className="text-sm font-bold text-gray-700 truncate">
              {order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              Items
            </p>
            <p className="text-sm font-bold text-gray-700">
              {order.items.length} units
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              Date
            </p>
            <p className="text-sm font-bold text-gray-700">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
              Total Amount
            </p>
            <p className="text-2xl font-black text-primary">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
            Order Details
          </p>
          <div className="grid gap-3">
            {order.items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 rounded-xl bg-white/40 border border-white/60 hover:bg-white/60 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100 shadow-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {item.productId?.name ?? 'Unknown Product'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity:{' '}
                      <span className="font-bold text-gray-700">
                        {item.quantity}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 bg-white/80 px-3 py-1 rounded-lg border border-white/60 shadow-sm">
                  ₹{item.lineTotal}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
