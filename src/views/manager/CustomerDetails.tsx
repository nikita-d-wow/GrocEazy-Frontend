import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Package,
  ChevronLeft,
  Calendar,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import OrderCard from '../../components/manager/orders/OrderCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import type { Order } from '../../redux/types/orderTypes';

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
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

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

  const fetchCustomerOrders = React.useCallback(async () => {
    try {
      // Using the search parameter to filter orders by user ID
      const res = await api.get(`/orders?search=${id}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching customer orders', err);
    } finally {
      setOrdersLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
      fetchCustomerOrders();
    }
  }, [id, fetchCustomerDetails, fetchCustomerOrders]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-10 text-center">
        <EmptyState
          title="Customer Not Found"
          description="We couldn't find a customer with the provided ID."
          icon={<UserIcon className="w-12 h-12" />}
        />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-emerald-600 font-bold flex items-center justify-center gap-2 mx-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-6 sm:px-12 lg:px-20 py-10 animate-fadeIn space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white/50 backdrop-blur-md border border-gray-100 rounded-xl hover:bg-emerald-50 hover:text-emerald-500 transition shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title="Customer"
          highlightText="Details"
          subtitle="Complete profile and order history"
          icon={UserIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <UserIcon className="w-32 h-32" />
            </div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                <UserIcon className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.name}
              </h2>
              <p className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full mt-2">
                {customer.role.toUpperCase()}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/40 border border-white/50 rounded-2xl">
                <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/40 border border-white/50 rounded-2xl">
                <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {customer.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/40 border border-white/50 rounded-2xl">
                <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/40 border border-white/50 rounded-2xl">
                <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Account Status
                  </p>
                  <p
                    className={`text-sm font-semibold ${customer.isActive ? 'text-emerald-600' : 'text-red-500'}`}
                  >
                    {customer.isActive ? 'Active' : 'Deactivated'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Saved Addresses
            </h3>
            <div className="space-y-4">
              {customer.addresses && customer.addresses.length > 0 ? (
                customer.addresses.map((addr, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border ${addr.isDefault ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 bg-white/30'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-gray-800">
                        Address {idx + 1}
                      </p>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No addresses saved.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-emerald-500" />
              Order History
              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase ml-1">
                {orders.length} Orders
              </span>
            </h3>
          </div>

          <div className="space-y-6">
            {ordersLoading ? (
              <div className="py-20 flex justify-center">
                <Loader />
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={async (id, status) => {
                    try {
                      await api.patch(`/orders/${id}/status`, { status });
                      fetchCustomerOrders();
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.error('Error updating order status', err);
                    }
                  }}
                />
              ))
            ) : (
              <EmptyState
                title="No Orders Yet"
                description="This customer hasn't placed any orders yet."
                icon={
                  <Package className="w-12 h-12 opacity-20 text-gray-400" />
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
