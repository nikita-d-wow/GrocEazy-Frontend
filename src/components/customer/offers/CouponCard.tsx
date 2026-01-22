import type { FC } from 'react';
import { useState } from 'react';
import { Ticket, Copy, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Coupon } from '../../../redux/types/couponTypes';

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard: FC<CouponCardProps> = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`Code ${coupon.code} copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(coupon.endDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative group bg-white rounded-3xl border border-dashed border-gray-200 p-6 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Scalloped edge effect (top) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-50 border border-gray-100"
          />
        ))}
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-green-50 rounded-2xl text-green-600 group-hover:scale-110 transition-transform duration-500">
          <Ticket size={24} />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Expires On
          </span>
          <p
            className={`text-xs font-bold ${isExpired ? 'text-red-500' : 'text-gray-900'}`}
          >
            {new Date(coupon.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex items-baseline gap-1 mb-1">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">
            {coupon.discountType === 'percentage'
              ? `${coupon.discountValue}%`
              : `₹${coupon.discountValue}`}
          </h3>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            OFF
          </span>
        </div>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
          On orders over{' '}
          <span className="text-gray-900 font-bold">
            ₹{coupon.minOrderAmount}
          </span>
        </p>

        {coupon.maxDiscountAmount && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50/50 px-2 py-1 rounded-lg w-fit mb-4">
            <Info size={10} />
            UP TO ₹{coupon.maxDiscountAmount} SAVINGS
          </div>
        )}
      </div>

      {/* Visual Divider */}
      <div className="relative my-4 flex items-center">
        <div className="flex-grow border-t border-dashed border-gray-200"></div>
        <div className="absolute -left-8 w-4 h-4 rounded-full bg-gray-50 border border-gray-100"></div>
        <div className="absolute -right-8 w-4 h-4 rounded-full bg-gray-50 border border-gray-100"></div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-green-200 transition-colors">
          <span className="font-black text-gray-900 tracking-widest uppercase ml-1">
            {coupon.code}
          </span>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-xl transition-all duration-300 ${
              copied
                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                : 'bg-white text-gray-500 hover:text-green-600 shadow-sm border border-gray-200 hover:border-green-200'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={copied ? 'check' : 'copy'}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
          Tap to copy & use at checkout
        </p>
      </div>
    </motion.div>
  );
};

export default CouponCard;
