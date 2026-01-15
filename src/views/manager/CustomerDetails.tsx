import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import OrderCard from '../../components/manager/orders/OrderCard';
import Pagination from '../../components/common/Pagination';
import {
  getAllOrders,
  changeOrderStatus,
} from '../../redux/actions/orderActions';
import type { RootState, AppDispatch } from '../../redux/store';
import { AnalyticsSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

interface ICustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

interface ICustomer {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  isActive: boolean;
  addresses: ICustomerAddress[];
}

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [customer, setCustomer] = React.useState<ICustomer | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    orders,
    pagination,
    loading: ordersLoading,
  } = useSelector((state: RootState) => state.order);

  const fetchCustomerDetails = React.useCallback(async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setCustomer(res.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching customer details', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id, fetchCustomerDetails]);

  useEffect(() => {
    if (id) {
      dispatch(
        getAllOrders(page, limit, 'all', undefined, 'newest', undefined, id)
      );
    }
  }, [id, page, dispatch]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <EmptyState
          title="Customer Not Found"
          description="We couldn't find a customer with the provided ID."
          icon={<UserIcon className="w-12 h-12" />}
        />
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-4 sm:px-8 lg:px-12 py-6 animate-fadeIn space-y-6">
      <PageHeader
        title="Customer"
        highlightText="Profile"
        subtitle="Manage customer account and history"
        icon={UserIcon}
        onBack={() => navigate(-1)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Column */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-xl shadow-gray-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <UserIcon className="w-24 h-24" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                <UserIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {customer.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-emerald-600 font-black bg-emerald-100/50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                    {customer.role}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${customer.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'Email Address',
                  value: customer.email,
                  icon: Mail,
                  color: 'blue',
                },
                {
                  label: 'Phone Number',
                  value: customer.phone || 'Not provided',
                  icon: Phone,
                  color: 'purple',
                },
                {
                  label: 'Member Since',
                  value: new Date(customer.createdAt).toLocaleDateString(
                    'en-US',
                    { month: 'short', year: 'numeric' }
                  ),
                  icon: Calendar,
                  color: 'amber',
                },
                {
                  label: 'Status',
                  value: customer.isActive ? 'Active' : 'Inactive',
                  icon: ShieldCheck,
                  color: 'emerald',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/40 border border-white/40 rounded-xl"
                >
                  <div
                    className={`p-2 bg-${item.color}-50 text-${item.color}-500 rounded-lg`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-gray-700 truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[1.5rem] p-6 shadow-xl shadow-gray-200/40">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-red-500" />
              Saved Addresses
            </h3>
            <div className="space-y-3">
              {customer.addresses?.length > 0 ? (
                customer.addresses.map((addr, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${addr.isDefault ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-100 bg-white/30'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Address {idx + 1}
                      </p>
                      {addr.isDefault && (
                        <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-snug font-medium">
                      {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic py-2">
                  No addresses saved.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Orders Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-[1.5rem] p-6 shadow-xl shadow-gray-100/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-500" />
                Purchasing History
                {pagination?.total !== undefined && (
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg uppercase ml-2">
                    {pagination.total} Records
                  </span>
                )}
              </h3>
            </div>

            <div className="space-y-6">
              {ordersLoading ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-40">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    Syncing Records...
                  </p>
                </div>
              ) : orders.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="animate-in slide-in-from-bottom-2 duration-300"
                      >
                        <OrderCard
                          order={order}
                          onStatusChange={(id, status) =>
                            dispatch(changeOrderStatus(id, status))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {pagination && pagination.pages > 1 && (
                    <div className="pt-6 border-t border-gray-100">
                      <Pagination
                        currentPage={page}
                        totalPages={pagination.pages}
                        onPageChange={setPage}
                        isLoading={ordersLoading}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white/50 border border-dashed border-gray-200 rounded-3xl p-12 text-center">
                  <EmptyState
                    title="No Transactions Found"
                    description="This customer hasn't established a purchase history yet."
                    icon={
                      <Package className="w-10 h-10 opacity-10 text-gray-400" />
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
