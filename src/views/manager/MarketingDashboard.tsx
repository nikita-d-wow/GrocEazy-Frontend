import { useState, useEffect, type FC } from 'react';
import {
  Ticket,
  Plus,
  Zap,
  Trash2,
  Users,
  Edit2,
  Megaphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import {
  fetchActiveOffers,
  deleteOffer,
} from '../../redux/actions/offerActions';
import { fetchCoupons, deleteCoupon } from '../../redux/actions/couponActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { getUsers } from '../../redux/actions/userActions';
import type { RootState } from '../../redux/store';

import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import OfferForm from '../../components/offers/OfferForm';
import CouponForm from '../../components/coupons/CouponForm';

/* ================= TYPES ================= */

const ITEMS_PER_PAGE = 6;

/* ================= COMPONENTS ================= */

const OffersTab = ({
  offers,
  onEdit,
  currentPage,
  onPageChange,
}: {
  offers: any[];
  onEdit: (o: any) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const dispatch = useAppDispatch();

  const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOffers = offers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {paginatedOffers.map((offer) => (
          <motion.div
            key={offer._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-100 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(offer)}
                  className="p-2.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-green-200"
                  title="Edit offer"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => dispatch(deleteOffer(offer._id))}
                  className="p-2.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
                  title="Delete offer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
              {offer.title}
            </h4>
            <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2 h-8">
              {offer.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-sm font-black text-emerald-600">
                  {offer.offerType === 'percentage'
                    ? `${offer.discountValue}% OFF`
                    : `₹${offer.discountValue} OFF`}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {offer.customerSegment === 'all'
                    ? 'All Users'
                    : offer.customerSegment === 'new_users'
                      ? 'New Only'
                      : 'VIP Only'}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest block ${offer.isActive ? 'text-green-500' : 'text-gray-300'}`}
                >
                  {offer.isActive ? 'Active' : 'Paused'}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">
                  {new Date(offer.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        {paginatedOffers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              No active campaigns
            </p>
          </div>
        )}
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

const VouchersTab = ({
  coupons,
  onEdit,
  currentPage,
  onPageChange,
}: {
  coupons: any[];
  onEdit: (c: any) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const dispatch = useAppDispatch();

  const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCoupons = coupons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {paginatedCoupons.map((coupon) => (
          <motion.div
            key={coupon._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-gray-100 p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}{' '}
                  Off
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(coupon)}
                    className="p-2.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-green-200"
                    title="Edit coupon"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => dispatch(deleteCoupon(coupon._id))}
                    className="p-2.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
                    title="Delete coupon"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h4 className="font-mono text-lg font-black text-gray-900 mb-0 leading-none">
                {coupon.code}
              </h4>
              <p className="text-[11px] font-black text-gray-500 mb-1 truncate">
                {coupon.name}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                Min Order: ₹{coupon.minOrderAmount}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                  <Users size={12} /> {coupon.usedCount || 0} Uses
                </div>
                <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest">
                  Exp: {new Date(coupon.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
        {paginatedCoupons.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              No active vouchers
            </p>
          </div>
        )}
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

/* ================= MAIN DASHBOARD ================= */

const MarketingDashboard: FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'vouchers'>(
    'campaigns'
  );
  const [campaignsPage, setCampaignsPage] = useState(1);
  const [vouchersPage, setVouchersPage] = useState(1);

  const { activeOffers } = useSelector((state: RootState) => state.offer);
  const { coupons } = useSelector((state: RootState) => state.coupon);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchActiveOffers());
    dispatch(fetchCoupons());
    dispatch(fetchCategories());
    dispatch(getUsers(1, '', ''));
  }, [dispatch]);

  const openOfferModal = (offer: any = null) => {
    setEditingItem(offer);
    setIsOfferModalOpen(true);
  };

  const openCouponModal = (coupon: any = null) => {
    setEditingItem(coupon);
    setIsCouponModalOpen(true);
  };

  const handleTabChange = (tab: 'campaigns' | 'vouchers') => {
    setActiveTab(tab);
    // Reset to page 1 when switching tabs
    if (tab === 'campaigns') {
      setCampaignsPage(1);
    } else {
      setVouchersPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <PageHeader
          title="Marketing Hub"
          subtitle="Manage campaigns, vouchers, and promotional strategies"
          icon={Megaphone}
        >
          {activeTab === 'campaigns' ? (
            <Button
              onClick={() => openOfferModal()}
              leftIcon={<Plus size={20} />}
              className="w-full sm:w-auto justify-center shadow-lg shadow-green-200/50"
            >
              Add Campaign
            </Button>
          ) : (
            <Button
              onClick={() => openCouponModal()}
              leftIcon={<Plus size={20} />}
              className="w-full sm:w-auto justify-center shadow-lg shadow-green-200/50"
            >
              Add Coupon
            </Button>
          )}
        </PageHeader>

        {/* Dashboard Tabs */}
        <div className="bg-white p-2 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between mb-10 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {[
              {
                id: 'campaigns',
                label: 'Campaigns',
                icon: <Megaphone size={18} />,
              },
              { id: 'vouchers', label: 'Vouchers', icon: <Ticket size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-3xl font-black text-sm transition-all duration-300
                                    ${activeTab === tab.id ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'campaigns' && (
              <OffersTab
                offers={activeOffers}
                onEdit={openOfferModal}
                currentPage={campaignsPage}
                onPageChange={setCampaignsPage}
              />
            )}
            {activeTab === 'vouchers' && (
              <VouchersTab
                coupons={coupons}
                onEdit={openCouponModal}
                currentPage={vouchersPage}
                onPageChange={setVouchersPage}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <OfferForm
            offer={editingItem}
            onClose={() => setIsOfferModalOpen(false)}
            onSuccess={() => dispatch(fetchActiveOffers())}
          />
        )}

        {isCouponModalOpen && (
          <CouponForm
            coupon={editingItem}
            onClose={() => setIsCouponModalOpen(false)}
            onSuccess={() => dispatch(fetchCoupons())}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketingDashboard;
