export function getOptimizedImage(
  url: string | undefined,
  optionsOrWidth:
    | { width?: number; height?: number; quality?: string }
    | number = {}
): string {
  if (!url) {
    return '';
  }
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  let width = 100;
  let height = 100;
  let quality = 'auto';

  if (typeof optionsOrWidth === 'number') {
    width = optionsOrWidth;
    height = optionsOrWidth;
  } else {
    width = optionsOrWidth.width || 100;
    height = optionsOrWidth.height || optionsOrWidth.width || 100;
    quality = optionsOrWidth.quality || 'auto';
  }

  const transformation = `w_${width},h_${height},c_fill,f_auto,q_${quality}`;

  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformation}/`);
  }

  return url;
}

export const optimizeCloudinaryUrl = getOptimizedImage;
