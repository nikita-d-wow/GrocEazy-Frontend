import type { Offer } from '../redux/types/offerTypes';
import type { Product } from '../types/Product';

/**
 * Calculates the best available offer for a given product from a list of active offers.
 */
export const getBestOffer = (
  product: Product | null | undefined,
  activeOffers: Offer[] | null | undefined
): Offer | null => {
  if (!product || !activeOffers || activeOffers.length === 0) {
    return null;
  }

  const _id = product._id;
  const categoryId =
    typeof product.categoryId === 'object'
      ? (product.categoryId as { _id: string })._id
      : product.categoryId;

  const applicableOffers = activeOffers.filter((offer) => {
    // 1. Check Exclusions
    const isExcluded = offer.excludedProducts?.some(
      (id) => id === _id || (typeof id === 'object' && (id as any)._id === _id)
    );
    if (isExcluded) {
      return false;
    }

    // 2. Check Direct Product Match
    const isDirectProduct = offer.applicableProducts?.some(
      (id) => id === _id || (typeof id === 'object' && (id as any)._id === _id)
    );
    if (isDirectProduct) {
      return true;
    }

    // 3. Check Category Match
    const isDirectCategory = offer.applicableCategories?.some(
      (id) =>
        id === categoryId ||
        (typeof id === 'object' && (id as any)._id === categoryId)
    );
    if (isDirectCategory) {
      return true;
    }

    return false;
  });

  if (applicableOffers.length === 0) {
    return null;
  }

  // Sort by highest discount
  return [...applicableOffers].sort((a, b) => {
    const calculateValue = (offer: Offer) => {
      if (offer.offerType === 'percentage') {
        return offer.discountValue || 0;
      }
      // Convert fixed amount to percentage for comparison if needed, or just compare raw value impact
      // Better: Compare actual monetary savings
      return offer.offerType === 'fixed'
        ? offer.discountValue || 0
        : (product.price * (offer.discountValue || 0)) / 100;
    };

    return calculateValue(b) - calculateValue(a);
  })[0];
};

export interface PriceDetails {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  appliedOffer: Offer | null;
}

/**
 * Calculates price details including discount based on the best available offer.
 */
export const calculateProductPrice = (
  product: Product | null | undefined,
  activeOffers: Offer[] | null | undefined
): PriceDetails => {
  if (!product) {
    return {
      originalPrice: 0,
      discountedPrice: 0,
      discountAmount: 0,
      discountPercentage: 0,
      appliedOffer: null,
    };
  }

  const bestOffer = getBestOffer(product, activeOffers);
  const originalPrice = product.price;

  if (!bestOffer) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountPercentage: 0,
      appliedOffer: null,
    };
  }

  let discountAmount = 0;
  if (bestOffer.offerType === 'percentage') {
    discountAmount = (originalPrice * (bestOffer.discountValue || 0)) / 100;
  } else if (bestOffer.offerType === 'fixed') {
    discountAmount = bestOffer.discountValue || 0;
  }

  // Ensure discount doesn't exceed price
  discountAmount = Math.min(discountAmount, originalPrice);

  const discountedPrice = Number((originalPrice - discountAmount).toFixed(2));
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

  return {
    originalPrice,
    discountedPrice,
    discountAmount,
    discountPercentage,
    appliedOffer: bestOffer,
  };
};
