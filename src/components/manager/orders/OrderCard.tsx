import OrderStatusSelect from './OrderStatusSelect';

interface Props {
  order: any;
  onStatusChange: (id: string, status: string) => void;
}

const OrderCard = ({ order, onStatusChange }: Props) => {
  return (
    <div className="rounded-[32px] bg-white/60 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:shadow-[0_35px_80px_rgba(0,0,0,0.12)] transition-all">
      <div className="px-12 py-10 space-y-10">
        {/* USER + STATUS */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {order.userId.name}
            </p>
            <p className="text-sm text-gray-500">{order.userId.email}</p>
            <p className="text-sm text-gray-400">
              {order.address.city}, {order.address.state} ·{' '}
              {order.address.phone}
            </p>
          </div>

          <OrderStatusSelect
            status={order.status}
            disabled={order.status === 'Delivered'}
            onChange={(status) => onStatusChange(order._id, status)}
          />
        </div>

        {/* META */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 rounded-2xl bg-white/70 backdrop-blur px-10 py-7 text-sm shadow-inner">
          <div>
            <p className="text-xs text-gray-400 mb-1">Order ID</p>
            <p className="font-medium text-gray-700 truncate">{order._id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Items</p>
            <p className="font-medium text-gray-700">{order.items.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Date</p>
            <p className="font-medium text-gray-700">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-5">
          {order.items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex justify-between items-center rounded-2xl bg-white/70 backdrop-blur px-10 py-5 text-sm shadow-sm"
            >
              <span className="text-gray-600">
                Product ·{' '}
                <span className="text-gray-400">
                  {typeof item.productId === 'object'
                    ? item.productId.name
                    : item.productId}
                </span>{' '}
                × {item.quantity}
              </span>
              <span className="text-base font-semibold text-gray-800">
                ₹{item.lineTotal}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
