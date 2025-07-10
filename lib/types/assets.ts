// Asset types for stock images, icons, and other media
export interface BaseAsset {
  id: string;
  url: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  alt?: string;
  tags: string[];
  source: 'unsplash' | 'pexels' | 'pixabay' | 'iconify' | 'flaticon' | 'lorem-picsum' | 'picsum' | 'unsplash-source' | 'themed-source' | 'curated-demo' | 'simple-icons';
  attribution?: string;
  license?: string;
}

export interface StockImage extends BaseAsset {
  type: 'image';
  width: number;
  height: number;
  aspectRatio: number;
  photographer?: string;
  photographerUrl?: string;
  downloadUrl: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  colors: string[];
  description?: string;
}

export interface Icon extends BaseAsset {
  type: 'icon';
  category: string;
  style: 'solid' | 'outline' | 'filled' | 'two-tone' | 'brand';
  format: 'svg' | 'png' | 'ico';
  sizes: number[];
  vectorUrl?: string;
  downloadUrls: {
    svg?: string;
    png?: Record<number, string>;
  };
}

export interface AssetSearchParams {
  query: string;
  type: 'image' | 'icon' | 'all';
  category?: string;
  color?: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'small' | 'medium' | 'large';
  per_page?: number;
  page?: number;
  safe_search?: boolean;
  min_width?: number;
  min_height?: number;
  style?: string;
}

export interface AssetSearchResponse {
  assets: (StockImage | Icon)[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface AssetCollection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  assets: (StockImage | Icon)[];
  totalAssets: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response types for different services
export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  width: number;
  height: number;
  color: string;
  alt_description: string | null;
  description: string | null;
  tags: Array<{ title: string }>;
  user: {
    name: string;
    links: { html: string };
  };
  links: {
    download: string;
  };
}

export interface PexelsPhoto {
  id: number;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  width: number;
  height: number;
  alt: string;
  avg_color: string;
}

export interface IconifyIcon {
  prefix: string;
  name: string;
  body: string;
  width?: number;
  height?: number;
  viewBox?: string;
  tags?: string[];
  category?: string;
}

export interface AssetError {
  code: string;
  message: string;
  details?: any;
} 