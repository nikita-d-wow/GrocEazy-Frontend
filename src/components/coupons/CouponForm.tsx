import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import toast from 'react-hot-toast';
import {
  Ticket,
  ShieldCheck,
  Zap,
  ChevronRight,
  Info,
  Calendar,
  Globe,
  Layers,
} from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { createCoupon, updateCoupon } from '../../redux/actions/couponActions';

import type { Coupon } from '../../redux/types/couponTypes';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const optionalNumber = z.preprocess(
  (val) =>
    val === '' || val === null || val === undefined ? undefined : Number(val),
  z.number().min(0).optional()
);

const couponSchema = z
  .object({
    code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: optionalNumber,
    minOrderAmount: optionalNumber,
    maxDiscountAmount: optionalNumber,
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    usageLimit: optionalNumber,
    usageLimitPerUser: optionalNumber,
    isActive: z.boolean(),
    applicableCategories: z.array(z.string()).optional(),
    applicableProducts: z.array(z.string()).optional(),
    excludedProducts: z.array(z.string()).optional(),
    customerSegment: z.enum(['all', 'new_users']),
    stackable: z.boolean(),
    autoApply: z.boolean(),
    priority: z.coerce.number().int(),
    platforms: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (
        (data.discountType === 'percentage' || data.discountType === 'fixed') &&
        !data.discountValue
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Missing required fields for the selected discount type',
      path: ['discountType'],
    }
  );

type CouponFormData = z.infer<typeof couponSchema>;

interface Props {
  coupon?: Coupon | null;
  onClose: () => void;
  onSuccess?: () => void;
}

type TabType = 'general' | 'discount' | 'limits' | 'advanced';

const CouponForm: FC<Props> = ({ coupon, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema) as any,
    shouldUnregister: false, // Fix: Keep data on tab switch
    defaultValues: {
      code: coupon?.code || '',
      name: coupon?.name || '',
      description: coupon?.description || '',
      discountType: (coupon?.discountType as any) || 'percentage',
      discountValue: coupon?.discountValue || 0,
      minOrderAmount: coupon?.minOrderAmount || 0,
      maxDiscountAmount: coupon?.maxDiscountAmount || undefined,
      startDate: coupon?.startDate
        ? new Date(coupon.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      endDate: coupon?.endDate
        ? new Date(coupon.endDate).toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
      usageLimit: coupon?.usageLimit || 0,
      usageLimitPerUser: coupon?.usageLimitPerUser || 1,
      isActive: coupon ? coupon.isActive : true,
      applicableCategories: coupon?.applicableCategories || [],
      applicableProducts: coupon?.applicableProducts || [],
      excludedProducts: coupon?.excludedProducts || [],
      customerSegment: coupon?.customerSegment || 'all',
      stackable: coupon?.stackable || false,
      autoApply: coupon?.autoApply || false,
      priority: coupon?.priority || 0,
      platforms: coupon?.platforms || ['web', 'android', 'ios'],
    } as CouponFormData,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const discountType = watch('discountType');

  const platforms = watch('platforms') || [];

  const onSubmit = async (data: CouponFormData) => {
    const toastId = toast.loading(
      coupon ? 'Updating coupon...' : 'Creating coupon...'
    );
    try {
      if (coupon) {
        await dispatch(updateCoupon(coupon._id, data));
        toast.success('Coupon updated successfully', { id: toastId });
      } else {
        await dispatch(createCoupon(data));
        toast.success('Coupon created successfully', { id: toastId });
      }
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to save coupon', { id: toastId });
    }
  };

  const onError = () => {
    toast.error('Please fix validation errors on all tabs before saving', {
      icon: '⚠️',
      duration: 4000,
    });
  };

  const getTabErrors = (tabId: TabType) => {
    switch (tabId) {
      case 'general':
        return !!(
          errors.code ||
          errors.name ||
          errors.startDate ||
          errors.endDate
        );
      case 'discount':
        return !!(
          errors.discountType ||
          errors.discountValue ||
          errors.platforms ||
          errors.maxDiscountAmount
        );
      case 'limits':
        return !!(
          errors.minOrderAmount ||
          errors.customerSegment ||
          errors.usageLimit ||
          errors.usageLimitPerUser
        );

      // case 'advanced': return !!(errors.stackable || errors.autoApply || errors.priority); // Removed
      default:
        return false;
    }
  };

  const togglePlatform = (p: string) => {
    const current = [...platforms];
    if (current.includes(p)) {
      setValue(
        'platforms',
        current.filter((x) => x !== p)
      );
    } else {
      setValue('platforms', [...current, p]);
    }
  };

  const tabs = [
    { id: 'general', label: 'Basic Info', icon: Ticket },
    { id: 'discount', label: 'Discount', icon: Zap },
    { id: 'limits', label: 'Rules & Limits', icon: ShieldCheck },

    // { id: 'advanced', label: 'Advanced', icon: Settings }, // Removed
  ];

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={coupon ? 'Edit Coupon' : 'Create New Coupon'}
      maxWidth="3xl"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-56 flex flex-col gap-1">
          {tabs.map((tab) => {
            const hasTabError = getTabErrors(tab.id as TabType);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-200'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {hasTabError && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-200 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex-1 min-h-[450px]"
        >
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm text-gray-900">
                      <Info size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">
                        General Information
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Identify and define your coupon
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Coupon Code"
                      {...register('code')}
                      placeholder="e.g. SUMMER2025"
                      error={errors.code?.message}
                      className="uppercase"
                    />
                    <Input
                      label="Coupon Title/Name"
                      {...register('name')}
                      placeholder="e.g. 10% off for new users"
                      error={errors.name?.message}
                    />
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Internal Description
                      </label>
                      <textarea
                        {...register('description')}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white focus:border-gray-900 outline-none transition-all font-bold text-gray-900 min-h-[100px]"
                        placeholder="Notes about this coupon..."
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 md:col-span-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        {...register('isActive')}
                        className="w-5 h-5 rounded-lg accent-gray-900"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-black text-gray-900"
                      >
                        Coupon is currently active and ready to use
                      </label>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-[32px] bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm text-gray-900">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">Scheduling</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Valid dates for this campaign
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="date"
                      {...register('startDate')}
                      error={errors.startDate?.message}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      {...register('endDate')}
                      error={errors.endDate?.message}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'discount' && (
              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm text-gray-900">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">
                        Discount Logic
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        How much discount should be applied
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Discount Type
                      </label>
                      <div className="relative group">
                        <select
                          {...register('discountType')}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-black text-gray-900 transition-all outline-none appearance-none cursor-pointer focus:border-gray-900"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-gray-400" />
                      </div>
                    </div>
                    {(discountType === 'percentage' ||
                      discountType === 'fixed') && (
                      <Input
                        label={
                          discountType === 'percentage'
                            ? 'Percentage Value (%)'
                            : 'Discount Amount (₹)'
                        }
                        type="number"
                        {...register('discountValue')}
                        error={errors.discountValue?.message}
                      />
                    )}
                    {discountType === 'percentage' && (
                      <Input
                        label="Max Discount Cap (₹)"
                        type="number"
                        {...register('maxDiscountAmount')}
                        error={errors.maxDiscountAmount?.message}
                        placeholder="Unlimited if empty"
                      />
                    )}
                  </div>
                </div>
                <div className="p-6 rounded-[32px] bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm text-gray-900">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">
                        Platform Restrictions
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Where can this coupon be used
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['web', 'android', 'ios'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        className={`flex-1 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          platforms.includes(p)
                            ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'limits' && (
              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm text-gray-900">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">
                        Usage Rules & Limits
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Protections and usage caps
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Min. Cart Value (₹)"
                      type="number"
                      {...register('minOrderAmount')}
                      error={errors.minOrderAmount?.message}
                    />
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Customer Segment
                      </label>
                      <div className="relative group">
                        <select
                          {...register('customerSegment')}
                          className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-black text-gray-900 transition-all outline-none appearance-none cursor-pointer focus:border-gray-900"
                        >
                          <option value="all">All Customers</option>
                          <option value="new_users">New Customers Only</option>
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-gray-400" />
                      </div>
                    </div>
                    <Input
                      label="Total Usage Limit"
                      type="number"
                      {...register('usageLimit', { valueAsNumber: true })}
                      error={errors.usageLimit?.message}
                      placeholder="0 for unlimited"
                    />
                    <Input
                      label="Limit Per User"
                      type="number"
                      {...register('usageLimitPerUser', {
                        valueAsNumber: true,
                      })}
                      error={errors.usageLimitPerUser?.message}
                      placeholder="0 for unlimited"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-white shadow-sm text-gray-900">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">
                        Stackability & Priority
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        How this coupon interacts with others
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">
                          Stackable
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Allow with other coupons
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        {...register('stackable')}
                        className="w-6 h-6 rounded-lg accent-gray-900"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">
                          Auto-Apply
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Apply automatically to cart
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        {...register('autoApply')}
                        className="w-6 h-6 rounded-lg accent-gray-900"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Execution Priority"
                        type="number"
                        {...register('priority', { valueAsNumber: true })}
                        placeholder="Higher numbers execute first"
                        error={errors.priority?.message}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-gray-900 hover:bg-black shadow-xl shadow-gray-200 px-12 py-6 !rounded-[24px]"
            >
              {coupon ? 'Update Coupon' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CouponForm;
