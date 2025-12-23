import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft,
  MapPin,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from 'lucide-react';
import { getOrderDetails, cancelOrder } from '../../redux/actions/orderActions';
import type { RootState } from '../../redux/rootReducer';
import type { OrderActionTypes } from '../../redux/types/orderTypes';
import type { ThunkDispatch } from 'redux-thunk';

const STEPS = [
  { status: 'Pending', label: 'Order Placed', icon: Calendar },
  { status: 'Processing', label: 'Processing', icon: Clock },
  { status: 'Shipped', label: 'Shipped', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch =
    useDispatch<ThunkDispatch<RootState, undefined, OrderActionTypes>>();
  const { currentOrder, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Order not found</h3>
        <p className="text-gray-500 mt-2">
          {error || "We couldn't find the order details."}
        </p>
        <Link
          to="/orders"
          className="mt-4 text-primary font-medium hover:underline"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(
    (s) => s.status === currentOrder.status
  );
  const isCancelled = currentOrder.status === 'Cancelled';

  // Calculate progress for bar width
  const progressWidth = isCancelled
    ? 100
    : Math.max(5, (currentStepIndex / (STEPS.length - 1)) * 100);

  const canCancel = ['Pending', 'Processing'].includes(currentOrder.status);

  const handleCancelOrder = () => {
    if (id) {
      dispatch(cancelOrder(id));
      setShowCancelModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/orders"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ChevronLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500 text-sm">ID: {currentOrder._id}</p>
        </div>
        <div className="ml-auto">
          {isCancelled && (
            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
              <XCircle size={18} /> Cancelled
            </span>
          )}
        </div>
      </div>

      {/* TRACKING TIMELINE */}
      {!isCancelled && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <h2 className="font-semibold text-gray-900 mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
            {/* Active Progress Bar */}
            <div
              className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-1000 -z-10"
              style={{ width: `${progressWidth}%` }}
            ></div>

            <div className="flex justify-between relative z-10">
              {STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                        ${isCompleted || isCurrent ? 'bg-primary border-white text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400'}
                                    `}
                    >
                      <step.icon size={18} />
                    </div>
                    <span
                      className={`text-xs font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col: Items & Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* ITEMS LIST */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary" /> Items
            </h3>
            <div className="space-y-4">
              {currentOrder.items.map((item, index) => {
                // Safe check for missing product data
                if (!item.productId || typeof item.productId !== 'object') {
                  return (
                    <div key={`missing-${index}`} className="text-red-500 py-2">
                      Product information missing for this item.
                    </div>
                  );
                }

                return (
                  <div
                    key={item.productId._id}
                    className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0"
                  >
                    <img
                      src={
                        item.productId.images?.[0] ||
                        'https://via.placeholder.com/150'
                      }
                      alt={item.productId.name || 'Product'}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.productId.name || 'Unknown Product'}
                      </h4>
                      {item.productId.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                          {item.productId.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{item.unitPrice * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-medium text-gray-600">Total Amount</span>
              <span className="text-xl font-bold text-primary">
                ₹{currentOrder.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Address & Actions */}
        <div className="space-y-6">
          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" /> Delivery Details
            </h3>
            <address className="not-italic text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {currentOrder.address?.fullName || 'N/A'}
              </p>
              <p>{currentOrder.address?.line1 || ''}</p>
              <p>
                {currentOrder.address?.city || ''},{' '}
                {currentOrder.address?.state || ''}
              </p>
              <p>{currentOrder.address?.postalCode || ''}</p>
              <p className="mt-2 text-gray-500">
                Phone: {currentOrder.address?.phone || 'N/A'}
              </p>
            </address>
          </div>

          {/* ACTION ACTIONS */}
          {canCancel && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Manage Order</h3>
              <p className="text-xs text-gray-500 mb-4">
                You can cancel this order while it is still pending or
                processing.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Cancel Order?
            </h3>
            <p className="text-center text-gray-600 text-sm mb-6">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200 cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
