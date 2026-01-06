export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

const SIZE_MAP: Record<string, { width: number; height: number }> = {
  thumbnail: { width: 50, height: 50 },
  small: { width: 200, height: 200 },
  medium: { width: 500, height: 500 },
  large: { width: 1000, height: 1000 },
};

export function getOptimizedImage(
  url: string | undefined,
  optionsOrWidth:
    | { width?: number; height?: number; quality?: string; size?: ImageSize }
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
    if (optionsOrWidth.size && SIZE_MAP[optionsOrWidth.size]) {
      const preset = SIZE_MAP[optionsOrWidth.size];
      width = preset.width;
      height = preset.height;
    } else {
      width = optionsOrWidth.width || 100;
      height = optionsOrWidth.height || optionsOrWidth.width || 100;
    }
    quality = optionsOrWidth.quality || 'auto';
  }

  // Use f_auto (auto format) and q_auto (auto quality) for best results
  const transformation = `w_${width},h_${height},c_fill,f_auto,q_${quality}`;

  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformation}/`);
  }

  return url;
}

export const optimizeCloudinaryUrl = getOptimizedImage;
