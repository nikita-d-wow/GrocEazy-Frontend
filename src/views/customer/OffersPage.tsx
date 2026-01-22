import { type FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Ticket, Copy, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchActiveOffers } from '../../redux/actions/offerActions';
import { fetchCoupons } from '../../redux/actions/couponActions';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { fetchProducts } from '../../redux/actions/productActions';
import type { RootState } from '../../redux/store';
import ProductCard from '../../components/customer/ProductCard';
import PageHeader from '../../components/common/PageHeader';
import toast from 'react-hot-toast';

const NextGenOffersPage: FC = () => {
  const dispatch = useAppDispatch();
  const { activeOffers } = useSelector((state: RootState) => state.offer);
  const { coupons } = useSelector((state: RootState) => state.coupon);
  const { products } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchActiveOffers());
    dispatch(fetchCoupons());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const vouchers = coupons.filter((c) => c.isActive);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Page Header */}
      <PageHeader
        title="Offers & Deals"
        highlightText="Exclusive "
        subtitle="Discover amazing coupons and limited-time offers curated just for you"
        icon={Sparkles}
      />

      <div className="max-w-7xl mx-auto px-4 space-y-24">
        {/* Vouchers Section */}
        <section className="space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Voucher Wallet
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                Use these codes at checkout
              </p>
            </div>
          </div>

          {vouchers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
              <p className="text-gray-400 font-bold">
                No active coupons available right now.
              </p>
            </div>
          ) : (
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
              {vouchers.map((coupon, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="group bg-white rounded-[40px] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-100 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors" />
                  <div className="relative">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl w-fit mb-6">
                      <Ticket size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-0">
                      {coupon.discountValue}
                      {coupon.discountType === 'percentage' ? '%' : ' OFF'}
                    </h3>
                    <p className="text-[11px] text-indigo-600 font-black uppercase tracking-widest mb-1">
                      {coupon.name || 'Exclusive Reward'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mb-4 line-clamp-1">
                      {coupon.description}
                    </p>

                    {coupon.applicableProducts &&
                      coupon.applicableProducts.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                            Applicable on:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {coupon.applicableProducts
                              .slice(0, 3)
                              .map((p: any, i) => {
                                const productName =
                                  typeof p === 'string'
                                    ? products.find(
                                        (prod: any) => prod._id === p
                                      )?.name || 'Item'
                                    : p.name;
                                return (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold border border-indigo-100"
                                  >
                                    {productName}
                                  </span>
                                );
                              })}
                            {coupon.applicableProducts.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[9px] font-bold border border-gray-100">
                                +{coupon.applicableProducts.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          toast.success('Code copied!');
                        }}
                        className="flex items-center gap-2 font-black text-sm hover:translate-x-1 transition-transform text-indigo-600"
                      >
                        {coupon.code} <Copy size={16} />
                      </button>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} />
                        Active
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Special Offers */}
        {activeOffers.some((o: any) => o.applicableProducts?.length > 0) && (
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Weekly Special
              </h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                Boost your savings with these items
              </p>
            </div>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {activeOffers
                .filter((o: any) => o.applicableProducts?.length > 0)
                .map((offer: any, index: any) => {
                  const product = offer.applicableProducts[0];
                  if (!product || typeof product !== 'object') {
                    return null;
                  }

                  return (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="relative group"
                    >
                      <ProductCard
                        _id={product._id}
                        name={product.name}
                        image={product.images?.[0]}
                        price={product.price}
                        stock={product.stock}
                        categoryId={
                          product.categoryId?._id || product.categoryId
                        }
                        index={index}
                      />
                    </motion.div>
                  );
                })}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default NextGenOffersPage;
