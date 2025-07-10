// Asset management components
export { AssetSearch } from './AssetSearch';
export { AssetPicker } from './AssetPicker';
export { AssetGallery } from './AssetGallery';

// Types and hooks are exported from their respective modules
export type { StockImage, Icon, AssetSearchParams } from '@/lib/types/assets';
export { 
  useAssetSearch, 
  useAssetSearchInfinite, 
  useStockImages, 
  useIcons,
  useIconSvg,
  useDownloadAsset,
  useAssetRecommendations 
} from '@/lib/api/hooks'; 