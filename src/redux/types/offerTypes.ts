export interface Offer {
  _id: string;
  title: string;
  description?: string;
  offerType: 'percentage' | 'fixed';
  discountValue?: number;
  customerSegment: 'all' | 'new_users';
  applicableCategories: any[];
  applicableProducts: any[];
  excludedProducts: any[];
  minPurchaseAmount: number;
  minPurchaseQuantity: number;
  usageLimitPerUser: number;
  maxDiscountAmount?: number;
  autoApply: boolean;
  stackable: boolean;
  couponCode?: string;
  marketing: {
    bannerImage?: string;
    pushText?: string;
    badgeLabel?: string;
    showCountdown: boolean;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfferState {
  offers: Offer[];
  activeOffers: Offer[];
  loading: boolean;
  error: string | null;
}
