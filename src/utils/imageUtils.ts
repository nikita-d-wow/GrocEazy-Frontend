/**
 * Utility to inject Cloudinary optimization parameters into image URLs.
 * Example: w_400,c_limit,q_auto,f_auto
 */
export const getOptimizedImage = (
  url: string | undefined,
  width: number = 400
): string => {
  if (!url) {
    return '/img/placeholder.png';
  }

  // If it's already a local placeholder or not a Cloudinary URL, return as is
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Cloudinary URL format usually: .../upload/v1234567/filename.jpg
  // We want to insert transformations after /upload/
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.substring(0, uploadIndex + 8);
  const rest = url.substring(uploadIndex + 8);

  // Transformations:
  // w_[width] -> specific width
  // c_limit   -> don't upscale
  // q_auto    -> automatic quality
  // f_auto    -> automatic format (WebP/AVIF)
  const transformations = `w_${width},c_limit,q_auto,f_auto/`;

  return `${prefix}${transformations}${rest}`;
};
