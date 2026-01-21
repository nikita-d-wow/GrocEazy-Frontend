import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { createOffer, updateOffer } from '../../redux/actions/offerActions';
import { fetchPagedCategories } from '../../redux/actions/categoryActions';
import { fetchProducts } from '../../redux/actions/productActions';

import { selectCategories } from '../../redux/selectors/categorySelectors';
import { selectProducts } from '../../redux/selectors/productSelectors';

import type { Offer } from '../../redux/types/offerTypes';
import type { Category } from '../../types/Category';
import type { Product } from '../../types/Product';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { ChevronRight } from 'lucide-react';

// Helper for optional number
const optionalNumber = z.preprocess(
  (val) =>
    val === '' || val === null || val === undefined ? undefined : Number(val),
  z.number().min(0).optional()
);

const offerSchema = z
  .object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().optional(),
    offerType: z.enum(['percentage', 'fixed']),
    discountValue: optionalNumber,
    customerSegment: z.enum(['all', 'new_users']),
    applicableCategories: z.array(z.string()).optional(),
    applicableProducts: z.array(z.string()).optional(),
    excludedProducts: z.array(z.string()).optional(),
    minPurchaseAmount: optionalNumber,
    minPurchaseQuantity: optionalNumber,
    usageLimitPerUser: optionalNumber,
    maxDiscountAmount: z.preprocess(
      (val) =>
        val === '' || val === null || val === undefined
          ? undefined
          : Number(val),
      z.number().optional()
    ),
    autoApply: z.boolean(),
    stackable: z.boolean(),
    couponCode: z.string().optional(),
    marketing: z
      .object({
        bannerImage: z.string().optional(),
        pushText: z.string().optional(),
        badgeLabel: z.string().optional(),
        showCountdown: z.boolean(),
      })
      .optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      // Custom Validation Logic
      if (data.offerType === 'percentage' && !data.discountValue) {
        return false;
      }
      if (data.offerType === 'fixed' && !data.discountValue) {
        return false;
      }
      return true;
    },
    {
      message: 'Missing required fields for the selected offer type',
      path: ['offerType'], // Attach error to offerType field
    }
  );

type OfferFormData = z.infer<typeof offerSchema>;

import { Tag, ShieldCheck, Zap, Info, Layers, Package } from 'lucide-react';

interface Props {
  offer?: Offer | null;
  initialProductId?: string;
  initialCategoryId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const OfferForm: FC<Props> = ({
  offer,
  initialProductId,
  initialCategoryId,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    dispatch(fetchPagedCategories(1, 100));
    dispatch(fetchProducts(1, 100));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema) as any,
    shouldUnregister: false, // Fix: Keep data when switching tabs
    defaultValues: {
      title: offer?.title || '',
      description: offer?.description || '',
      offerType: offer?.offerType || 'percentage',
      discountValue: offer?.discountValue || 0,
      customerSegment: offer?.customerSegment || 'all',
      applicableCategories:
        offer?.applicableCategories?.map((c: Category | string) =>
          typeof c === 'string' ? c : c._id
        ) || (initialCategoryId ? [initialCategoryId] : []),
      applicableProducts:
        offer?.applicableProducts?.map((p: Product | string) =>
          typeof p === 'string' ? p : p._id
        ) || (initialProductId ? [initialProductId] : []),
      excludedProducts:
        offer?.excludedProducts?.map((p: Product | string) =>
          typeof p === 'string' ? p : p._id
        ) || [],
      minPurchaseAmount: offer?.minPurchaseAmount || 0,
      minPurchaseQuantity: offer?.minPurchaseQuantity || 0,
      usageLimitPerUser: offer?.usageLimitPerUser || 0,
      maxDiscountAmount: offer?.maxDiscountAmount,
      autoApply: offer?.autoApply ?? true,
      stackable: offer?.stackable ?? false,
      couponCode: offer?.couponCode || '',
      marketing: {
        bannerImage: offer?.marketing?.bannerImage || '',
        pushText: offer?.marketing?.pushText || '',
        badgeLabel: offer?.marketing?.badgeLabel || '',
        showCountdown: offer?.marketing?.showCountdown ?? false,
      },
      startDate: offer?.startDate
        ? new Date(offer.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      endDate: offer?.endDate
        ? new Date(offer.endDate).toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
      isActive: offer ? offer.isActive : true,
    },
  });

  const offerType = watch('offerType');
  const selectedCategories = watch('applicableCategories') || [];
  const selectedProducts = watch('applicableProducts') || [];
  const excludedProducts = watch('excludedProducts') || [];

  const toggleMultiSelect = (
    field: 'applicableCategories' | 'applicableProducts' | 'excludedProducts',
    id: string
  ) => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const current = watch(field) || [];
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    setValue(field, next);
  };

  const onSubmit = async (data: OfferFormData) => {
    const toastId = toast.loading(
      offer ? 'Updating offer...' : 'Creating offer...'
    );
    try {
      if (offer) {
        await dispatch(updateOffer(offer._id, data));
        toast.success('Offer updated successfully', { id: toastId });
      } else {
        await dispatch(createOffer(data));
        toast.success('Offer created successfully', { id: toastId });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save offer', {
        id: toastId,
      });
    }
  };

  const onError = () => {
    toast.error('Please fix validation errors on all tabs before saving', {
      icon: '⚠️',
      duration: 4000,
    });
  };

  const getTabErrors = (tabId: string) => {
    switch (tabId) {
      case 'general':
        return !!(errors.title || errors.startDate || errors.endDate);
      case 'discount':
        return !!(errors.discountValue || errors.maxDiscountAmount);
      case 'eligibility':
        return !!(
          errors.applicableCategories ||
          errors.applicableProducts ||
          errors.excludedProducts
        );
      case 'limits':
        return !!(
          errors.usageLimitPerUser ||
          errors.minPurchaseAmount ||
          errors.minPurchaseQuantity
        );
      // case 'marketing': return !!(errors.marketing || errors.couponCode); // Removed
      default:
        return false;
    }
  };

  const tabs = [
    { id: 'general', label: 'Basic Info', icon: Info },
    { id: 'discount', label: 'Offer Settings', icon: Zap },
    { id: 'eligibility', label: 'Eligibility', icon: Package },
    { id: 'limits', label: 'Rules & Targeting', icon: ShieldCheck },
    // { id: 'marketing', label: 'Advanced', icon: Globe }, // Removed
  ];

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={offer ? 'Edit Offer' : 'Create Campaign'}
      maxWidth="3xl"
    >
      <div className="flex flex-col md:flex-row h-full min-h-[600px]">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-gray-50/50 p-6 border-r border-gray-100 flex flex-col gap-1">
          {tabs.map((tab) => {
            const hasTabError = getTabErrors(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100 ring-4 ring-gray-900/5'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                }`}
              >
                <tab.icon
                  size={16}
                  className={
                    activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
                  }
                />
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
          className="flex-1 p-8 flex flex-col h-full bg-white"
        >
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">
                    Campaign Identity
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Internal title and customer facing description
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Offer Title"
                    {...register('title')}
                    placeholder="e.g. Summer Special 25%"
                    error={errors.title?.message}
                  />
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                      Offer Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-5 py-4 rounded-3xl border border-gray-200 bg-white font-black text-gray-900 transition-all outline-none focus:border-gray-900 placeholder:text-gray-300 placeholder:font-bold"
                      placeholder="Tell customers why this offer is great..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex items-center justify-between p-5 rounded-[32px] bg-gray-50 border border-gray-100">
                    <div>
                      <p className="font-black text-gray-900">Active Status</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Enable or disable campaign
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="w-8 h-8 rounded-xl accent-gray-900 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'discount' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">
                    Discount Configuration
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Define the type and value of discount
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                      Offer Type
                    </label>
                    <div className="relative">
                      <select
                        {...register('offerType')}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-black text-gray-900 transition-all outline-none appearance-none cursor-pointer focus:border-gray-900"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-gray-400" />
                    </div>
                  </div>

                  {(offerType === 'percentage' || offerType === 'fixed') && (
                    <Input
                      label={
                        offerType === 'percentage'
                          ? 'Percentage (%)'
                          : 'Amount (₹)'
                      }
                      type="number"
                      {...register('discountValue')}
                      error={errors.discountValue?.message}
                    />
                  )}

                  {offerType === 'percentage' && (
                    <Input
                      label="Max Discount Amount (₹)"
                      type="number"
                      {...register('maxDiscountAmount')}
                      placeholder="Leave empty for no cap"
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="space-y-6 animate-fadeIn h-full flex flex-col">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">
                    Inventory Scope
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Which products or categories can use this?
                  </p>
                </div>
                <div className="space-y-6 flex-1 overflow-y-auto">
                  <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={16} />
                      <h4 className="font-black text-sm">Target Categories</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar font-bold">
                      {categories.map((cat: Category) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() =>
                            toggleMultiSelect('applicableCategories', cat._id)
                          }
                          className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                            selectedCategories.includes(cat._id)
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Package size={16} />
                      <h4 className="font-black text-sm">Target Products</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar font-bold">
                      {products.map((prod: Product) => (
                        <button
                          key={prod._id}
                          type="button"
                          onClick={() =>
                            toggleMultiSelect('applicableProducts', prod._id)
                          }
                          className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                            selectedProducts.includes(prod._id)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          {prod.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center gap-2 mb-4 text-rose-600">
                      <ShieldCheck size={16} />
                      <h4 className="font-black text-sm">Exclude Products</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar font-bold">
                      {products.map((prod: Product) => (
                        <button
                          key={prod._id}
                          type="button"
                          onClick={() =>
                            toggleMultiSelect('excludedProducts', prod._id)
                          }
                          className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                            excludedProducts.includes(prod._id)
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'bg-white border-rose-200 text-rose-400 hover:border-rose-400'
                          }`}
                        >
                          {prod.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'limits' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">
                    Engagement & Rules
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Customer targeting and usage constraints
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                      Customer Segment
                    </label>
                    <div className="relative">
                      <select
                        {...register('customerSegment')}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white font-black text-gray-900 transition-all outline-none appearance-none cursor-pointer focus:border-gray-900"
                      >
                        <option value="all">Every Customer</option>
                        <option value="new_users">First Time Buyers</option>
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-gray-400" />
                    </div>
                  </div>
                  <Input
                    label="Limit Per User"
                    type="number"
                    {...register('usageLimitPerUser')}
                    placeholder="0 for unlimited"
                  />
                  <Input
                    label="Min. Spend (₹)"
                    type="number"
                    {...register('minPurchaseAmount')}
                  />
                  <Input
                    label="Min. Quantity"
                    type="number"
                    {...register('minPurchaseQuantity')}
                  />
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">
                    Marketing & Extras
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Banners, assets and system behavior
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input
                        label="Banner Image URL"
                        {...register('marketing.bannerImage')}
                        placeholder="https://image-url.com/sale.jpg"
                      />
                      <Input
                        label="Product Badge Label"
                        {...register('marketing.badgeLabel')}
                        placeholder="e.g. FLASH SALE"
                      />
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Push Note Text"
                        {...register('marketing.pushText')}
                        placeholder="Wait! Get 20% off today..."
                      />
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 h-[64px]">
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-900">
                            Countdown
                          </p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                            Show urgency timer
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          {...register('marketing.showCountdown')}
                          className="w-6 h-6 rounded-lg accent-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                          <Layers size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-indigo-900">
                            Auto-Apply
                          </p>
                          <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">
                            No code needed
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register('autoApply')}
                        className="w-6 h-6 rounded-lg accent-indigo-600"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                          <Layers size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-emerald-900">
                            Stackable
                          </p>
                          <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                            Combinable
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register('stackable')}
                        className="w-6 h-6 rounded-lg accent-emerald-600"
                      />
                    </div>
                  </div>
                  <Input
                    label="Promotion Code (Optional)"
                    {...register('couponCode')}
                    placeholder="e.g. SUMMER50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-gray-100 animate-slideUp">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 font-black tracking-widest uppercase text-[10px]"
            >
              Discard
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-gray-900 hover:bg-black text-white px-12 py-6 !rounded-[24px] shadow-2xl shadow-gray-200"
            >
              {offer ? 'Apply Changes' : 'Initialize Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OfferForm;
