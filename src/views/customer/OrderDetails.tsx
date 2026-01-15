import toast from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  Download,
  Receipt,
  Banknote,
} from 'lucide-react';
import DeliveryMap from '../../components/common/DeliveryMap';
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
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) {
      return;
    }

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${currentOrder?._id || 'order'}.pdf`);
    } catch (error) {
      toast.error('Error generating invoice');
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (showCancelModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCancelModal]);

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

  const handleCancelOrder = async () => {
    if (id) {
      await dispatch(cancelOrder(id));
      setShowCancelModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Hidden Invoice Template for PDF Generation */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div
          ref={invoiceRef}
          className="w-[800px] min-h-[1123px] p-12 font-sans"
          style={{ backgroundColor: '#ffffff', color: '#111827' }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-start mb-12 pb-8"
            style={{ borderBottom: '1px solid #e5e7eb' }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                >
                  <Package size={32} />
                </div>
                <h1
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: '#16a34a' }}
                >
                  GrocEazy
                </h1>
              </div>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Your Daily Grocery Partner
              </p>
              <p className="text-sm" style={{ color: '#6b7280' }}>
                support@groceazy.com
              </p>
            </div>
            <div className="text-right">
              <h2
                className="text-4xl font-extrabold mb-2"
                style={{ color: '#111827' }}
              >
                INVOICE
              </h2>
              <p className="font-medium" style={{ color: '#6b7280' }}>
                #{currentOrder._id.slice(-8).toUpperCase()}
              </p>
              <div
                className="mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: '#f0fdf4',
                  color: '#15803d',
                  border: '1px solid #dcfce7',
                }}
              >
                {isCancelled ? 'CANCELLED' : 'PAID'}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: '#9ca3af' }}
              >
                Billed To
              </h3>
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #f3f4f6',
                }}
              >
                <p
                  className="font-bold text-lg mb-2"
                  style={{ color: '#111827' }}
                >
                  {currentOrder.address?.fullName}
                </p>
                <p className="leading-relaxed" style={{ color: '#4b5563' }}>
                  {currentOrder.address?.line1}
                  <br />
                  {currentOrder.address?.city}, {currentOrder.address?.state}{' '}
                  {currentOrder.address?.postalCode}
                </p>
                <p
                  className="mt-3 flex items-center gap-2"
                  style={{ color: '#4b5563' }}
                >
                  <span className="font-semibold">Phone:</span>{' '}
                  {currentOrder.address?.phone}
                </p>
              </div>
            </div>
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: '#9ca3af' }}
              >
                Invoice Details
              </h3>
              <div className="space-y-3">
                <div
                  className="flex justify-between py-2"
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <span style={{ color: '#4b5563' }}>Order Date</span>
                  <span className="font-semibold" style={{ color: '#111827' }}>
                    {new Date(currentOrder.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>
                <div
                  className="flex justify-between py-2"
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <span style={{ color: '#4b5563' }}>Payment Method</span>
                  <span className="font-semibold" style={{ color: '#111827' }}>
                    Cash on Delivery
                  </span>
                </div>
                <div
                  className="flex justify-between py-2"
                  style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                  <span style={{ color: '#4b5563' }}>Total Items</span>
                  <span className="font-semibold" style={{ color: '#111827' }}>
                    {currentOrder.items.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <h3
              className="text-xs font-bold uppercase tracking-wider mb-4"
              style={{ color: '#9ca3af' }}
            >
              Order Items
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  <th
                    className="py-4 font-bold w-[50%]"
                    style={{ color: '#111827' }}
                  >
                    Item Description
                  </th>
                  <th
                    className="py-4 font-bold text-center"
                    style={{ color: '#111827' }}
                  >
                    Qty
                  </th>
                  <th
                    className="py-4 font-bold text-right"
                    style={{ color: '#111827' }}
                  >
                    Unit Price
                  </th>
                  <th
                    className="py-4 font-bold text-right"
                    style={{ color: '#111827' }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td className="py-4">
                      <p
                        className="font-bold text-sm"
                        style={{ color: '#111827' }}
                      >
                        {item.productId && typeof item.productId === 'object'
                          ? item.productId.name
                          : 'Product'}
                      </p>
                    </td>
                    <td
                      className="py-4 text-center font-medium"
                      style={{ color: '#4b5563' }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className="py-4 text-right font-medium"
                      style={{ color: '#4b5563' }}
                    >
                      ₹{item.unitPrice}
                    </td>
                    <td
                      className="py-4 text-right font-bold"
                      style={{ color: '#111827' }}
                    >
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-16">
            <div className="w-[300px] space-y-3">
              <div
                className="flex justify-between"
                style={{ color: '#4b5563' }}
              >
                <span>Subtotal</span>
                <span>₹{Number(currentOrder.totalAmount).toFixed(2)}</span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: '#4b5563' }}
              >
                <span>Shipping</span>
                <span className="font-medium" style={{ color: '#16a34a' }}>
                  Free
                </span>
              </div>
              <div
                className="flex justify-between"
                style={{ color: '#4b5563' }}
              >
                <span>Tax (0%)</span>
                <span>₹0.00</span>
              </div>
              <div
                className="my-4 pt-4 flex justify-between items-center"
                style={{ borderTop: '2px solid #111827' }}
              >
                <span
                  className="font-black text-xl"
                  style={{ color: '#111827' }}
                >
                  TOTAL
                </span>
                <span
                  className="font-black text-2xl"
                  style={{ color: '#16a34a' }}
                >
                  ₹{Number(currentOrder.totalAmount).toFixed(2)}
                </span>
              </div>
              <p
                className="text-xs text-right mt-2"
                style={{ color: '#9ca3af' }}
              >
                Inclusive of all taxes
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="pt-8 text-center text-sm"
            style={{ borderTop: '1px solid #f3f4f6', color: '#9ca3af' }}
          >
            <p className="mb-1">Thank you for shopping with GrocEazy!</p>
            <p>
              This is a computer generated invoice and does not require a
              physical signature.
            </p>
          </div>
        </div>
      </div>

      {/* Header & Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/orders"
          className="p-2 hover:bg-white bg-white/50 rounded-full transition shadow-sm border border-gray-100 hover:shadow-md"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <nav className="flex text-sm text-gray-500 mb-1">
            <span>My Orders</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Order Details</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{currentOrder._id.slice(-8)}
            </h1>
            {isCancelled && (
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-100">
                <XCircle size={14} /> Cancelled
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Placed on{' '}
            {new Date(currentOrder.createdAt).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            title="Download Invoice"
          >
            <Download size={16} />{' '}
            <span className="hidden sm:inline">Invoice</span>
          </button>
        </div>
      </div>

      {/* TRACKING TIMELINE */}
      {!isCancelled && (
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Package size={120} />
          </div>

          <h2 className="font-bold text-gray-900 mb-8 text-lg flex items-center gap-2">
            <Truck className="text-primary" size={20} /> Order Status
          </h2>

          <div className="relative px-4">
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 w-full h-1.5 bg-gray-100 rounded-full -z-10"></div>
            {/* Active Progress Bar */}
            <div
              className="absolute top-5 left-0 h-1.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 -z-10 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
              style={{ width: `${progressWidth}%` }}
            ></div>

            <div className="flex justify-between relative z-10">
              {STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center gap-3"
                  >
                    <div
                      className={`
                          w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                          ${
                            isCompleted || isCurrent
                              ? 'bg-green-600 border-white text-white shadow-lg scale-110'
                              : 'bg-white border-gray-100 text-gray-300'
                          }
                      `}
                    >
                      <step.icon size={20} />
                    </div>
                    <div className="text-center">
                      <span
                        className={`block text-xs font-bold uppercase tracking-wide mb-0.5 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col: Items & Payment */}
        <div className="md:col-span-2 space-y-8">
          {/* ITEMS LIST */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
              <Package size={20} className="text-gray-400" /> Items in Order
            </h3>
            <div className="space-y-6">
              {currentOrder.items.map((item) => {
                // Safe check for missing product data
                if (!item.productId || typeof item.productId !== 'object') {
                  return null;
                }

                return (
                  <div
                    key={item.productId._id}
                    className="flex gap-5 pb-6 border-b border-gray-50 last:border-0 last:pb-0 group"
                  >
                    <div className="w-20 h-20 rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.productId.images?.[0] ||
                          'https://via.placeholder.com/150'
                        }
                        alt={item.productId.name}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 text-base mb-1">
                        {item.productId.name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-xs">× ₹{item.unitPrice}</span>
                      </p>
                    </div>
                    <div className="flex flex-col justify-center text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Address & Actions */}
        <div className="space-y-6">
          {/* ORDER SUMMARY */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Receipt size={18} className="text-gray-400" /> Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{Number(currentOrder.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹0.00</span>
              </div>
              <div className="border-t border-dashed border-gray-200 my-2"></div>
              <div className="flex justify-between items-center text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-xl">
                  ₹{Number(currentOrder.totalAmount).toFixed(2)}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                    <Banknote size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                    <p className="text-xs">COD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-gray-400" /> Delivery Address
            </h3>
            <address className="not-italic text-sm text-gray-600 space-y-1.5 pl-1">
              <p className="font-bold text-gray-900 text-base">
                {currentOrder.address?.fullName || 'N/A'}
              </p>
              <p>{currentOrder.address?.line1 || ''}</p>
              <p>
                {currentOrder.address?.city || ''},{' '}
                {currentOrder.address?.state || ''}{' '}
                {currentOrder.address?.postalCode || ''}
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50 text-gray-500">
                <span className="font-medium">Phone:</span>{' '}
                {currentOrder.address?.phone || 'N/A'}
              </div>
            </address>
            {currentOrder.address && (
              <DeliveryMap address={currentOrder.address} />
            )}
          </div>

          {/* ACTION ACTIONS */}
          {canCancel && (
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                If you need to change items or shipping address, it's best to
                cancel and reorder while it's still processing.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 font-semibold hover:bg-red-100 hover:border-red-200 transition-colors cursor-pointer text-sm"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 mx-auto border-4 border-red-100">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              Cancel Order?
            </h3>
            <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
              >
                Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-200 cursor-pointer"
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
