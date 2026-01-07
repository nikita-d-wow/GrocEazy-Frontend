import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Clock,
  MapPin,
  Phone,
  Package,
  Hash,
  CreditCard,
} from 'lucide-react';

import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';
import type { AppDispatch } from '../../redux/store';
import type { RootState } from '../../redux/rootReducer';
import OrderStatusSelect from '../../components/manager/orders/OrderStatusSelect';
import Loader from '../../components/common/Loader';

export default function ManagerOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading } = useSelector((state: RootState) => state.order);

  // Find the order
  const order = useMemo(() => orders.find((o) => o._id === id), [orders, id]);

  useEffect(() => {
    if (!orders.length) {
      dispatch(getAllOrders(1, 100)); // Fetch a larger batch if none loaded
    }
  }, [dispatch, orders.length]);

  if (loading && !order) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-text mb-4 text-lg">Order not found</p>
          <button
            onClick={() => navigate('/manager/orders')}
            className="px-6 py-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: string) => {
    if (order._id) {
      dispatch(changeOrderStatus(order._id, status));
    }
  };

  const customerName = order.userId?.name ?? 'Guest User';
  const customerEmail = order.userId?.email ?? '—';

  return (
    <div className="min-h-screen py-10 px-6 sm:px-12 lg:px-20 animate-fadeIn pt-24">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/manager/orders')}
          className="flex items-center gap-2 text-muted-text hover:text-primary transition-colors group mb-4 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-card group-hover:bg-muted shadow-sm transition-all border border-border">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to Orders</span>
        </button>

        {/* MAIN CARD */}
        <div className="bg-card backdrop-blur-xl border border-border shadow-xl rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-emerald-400" />

          <div className="p-8 md:p-12">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10 pb-8 border-b border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
                    Order Details
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-text font-mono bg-muted px-2 py-1 rounded">
                    <Hash size={12} /> {order._id.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-text leading-tight">
                  Order for {customerName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-text">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-primary" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-primary" />
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 bg-muted p-4 rounded-2xl border border-border shadow-sm">
                <p className="text-[10px] uppercase font-bold text-muted-text mb-2 px-1">
                  Manage Status
                </p>
                <OrderStatusSelect
                  status={order.status}
                  onChange={handleStatusChange}
                  disabled={
                    order.status === 'Delivered' || order.status === 'Cancelled'
                  }
                />
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* CUSTOMER INFO */}
              <div className="p-6 rounded-2xl bg-blue-500/5 dark:bg-blue-900/10 border border-blue-500/10 shadow-sm">
                <h3 className="text-sm font-bold text-blue-500 mb-5 flex items-center gap-2 uppercase tracking-wide">
                  <User size={18} className="text-blue-500" />
                  Customer Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-blue-500 shadow-sm border border-blue-500/10">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-text font-bold uppercase tracking-tight">
                        Name
                      </p>
                      <p className="font-bold text-text">{customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-blue-500 shadow-sm border border-blue-500/10">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-text font-bold uppercase tracking-tight">
                        Email
                      </p>
                      <p className="font-bold text-text break-all">
                        {customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-blue-500 shadow-sm border border-blue-500/10">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-text font-bold uppercase tracking-tight">
                        Phone
                      </p>
                      <p className="font-bold text-text">
                        {order.address?.phone || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SHIPPING & PAYMENT */}
              <div className="p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-900/10 border border-emerald-500/10 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-500 mb-5 flex items-center gap-2 uppercase tracking-wide">
                  <MapPin size={18} className="text-emerald-500" />
                  Shipping & Payment
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-text font-bold uppercase tracking-tight">
                        Source Address
                      </p>
                      <p className="font-bold text-text leading-snug">
                        {order.address.line1}, {order.address.city}
                        <br />
                        {order.address.state} — {order.address.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-500/10">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-text font-bold uppercase tracking-tight">
                        Payment Mode
                      </p>
                      <p className="font-bold text-text uppercase">
                        {order.paymentMethod || 'COD'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text flex items-center gap-2">
                  <Package size={22} className="text-primary" />
                  Order Summary
                </h3>
                <span className="text-sm font-bold text-muted-text bg-muted px-3 py-1 rounded-full border border-border">
                  {order.items.length} Item(s)
                </span>
              </div>

              <div className="grid gap-4">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-6 rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-xs font-bold text-muted-text border border-border shadow-sm group-hover:scale-105 transition-transform">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-text text-base group-hover:text-primary transition-colors">
                          {item.productId?.name ?? 'Unknown Product'}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-muted-text">
                            Qty:{' '}
                            <span className="font-bold text-text">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="text-border">|</span>
                          <span className="text-muted-text">
                            Unit Price:{' '}
                            <span className="font-bold text-text">
                              ₹{Number(item.unitPrice).toFixed(2)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-text">
                        ₹{Number(item.lineTotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL SECTION */}
              <div className="mt-10 p-8 rounded-3xl bg-gray-900 dark:bg-card text-white dark:text-text flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-2xl relative overflow-hidden border border-border">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative">
                  <p className="text-gray-400 dark:text-muted-text font-bold uppercase tracking-widest text-xs mb-1">
                    Grand Total
                  </p>
                  <p className="text-4xl font-black text-white dark:text-text">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
                <div className="relative flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-bold tracking-wide uppercase text-sm">
                    Status: {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
