export interface Coupon {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageLimitPerUser: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories: string[];
  applicableProducts: string[];
  excludedProducts: string[];
  customerSegment: 'all' | 'new_users';
  stackable: boolean;
  autoApply: boolean;
  priority: number;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  validation: {
    valid: boolean;
    discountAmount: number;
    message?: string;
    code?: string;
    discountType?: 'percentage' | 'fixed';
  } | null;
}
