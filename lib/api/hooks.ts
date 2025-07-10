import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { User } from '../db/schema';

// User Profile Hooks - only essential user management
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.get<{ user: User }>('/user/profile'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string }) =>
      apiClient.put<{ user: User }>('/user/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

export function useSyncUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data?: { firstName?: string; lastName?: string }) =>
      apiClient.post<{ user: User }>('/auth/sync', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
} 

// Asset hooks
import { 
  AssetSearchParams, 
  AssetSearchResponse, 
  StockImage, 
  Icon 
} from '../types/assets';

export function useAssetSearch(params: AssetSearchParams) {
  return useQuery({
    queryKey: ['assets', 'search', params],
    queryFn: async () => {
      const response = await apiClient.publicPost<{ success: boolean; data: AssetSearchResponse }>('/assets/search', params);
      return response.data;
    },
    enabled: !!params.query && params.query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useAssetSearchInfinite(baseParams: Omit<AssetSearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['assets', 'search', 'infinite', baseParams],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { ...baseParams, page: pageParam as number };
      const response = await apiClient.publicPost<{ success: boolean; data: AssetSearchResponse }>('/assets/search', params);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: AssetSearchResponse) => {
      if (lastPage.hasMore && lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    enabled: !!baseParams.query && baseParams.query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useStockImages(query: string, options?: Partial<AssetSearchParams>) {
  const params: AssetSearchParams = {
    query,
    type: 'image',
    ...options,
  };

  return useAssetSearch(params);
}

export function useIcons(query: string, options?: Partial<AssetSearchParams>) {
  const params: AssetSearchParams = {
    query,
    type: 'icon',
    ...options,
  };

  return useAssetSearch(params);
}

export function useIconSvg(prefix: string, name: string) {
  return useQuery({
    queryKey: ['assets', 'icon', 'svg', prefix, name],
    queryFn: async () => {
      const response = await fetch(`/api/assets/icon/${prefix}/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch icon SVG');
      }
      return response.text();
    },
    enabled: !!(prefix && name),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Mutation for downloading assets
export function useDownloadAsset() {
  return useMutation({
    mutationFn: async ({ url, filename }: { url: string; filename?: string }) => {
      const response = await fetch('/api/assets/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, filename }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      return { blob, filename: filename || `download-${Date.now()}` };
    },
    onSuccess: ({ blob, filename }) => {
      // Trigger download in browser
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

// Custom hook for managing asset collections
export function useAssetCollection(collectionId?: string) {
  return useQuery({
    queryKey: ['assets', 'collection', collectionId],
    queryFn: async () => {
      if (!collectionId) return null;
      
      // This would call a collection API endpoint when implemented
      const response = await apiClient.get<any>(`/assets/collections/${collectionId}`);
      return response;
    },
    enabled: !!collectionId,
  });
}

// Hook for asset recommendations based on current search
export function useAssetRecommendations(currentAssets: (StockImage | Icon)[], limit = 10) {
  return useQuery({
    queryKey: ['assets', 'recommendations', currentAssets.map(a => a.id).join(',')],
    queryFn: async () => {
      if (currentAssets.length === 0) return [];
      
      // Extract tags from current assets for recommendation
      const allTags = currentAssets.flatMap(asset => asset.tags);
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Get most common tags
      const topTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);
      
      if (topTags.length === 0) return [];
      
      // Search for similar assets
      const params: AssetSearchParams = {
        query: topTags.join(' '),
        type: 'all',
        per_page: limit,
      };
      
      const response = await apiClient.publicPost<{ success: boolean; data: AssetSearchResponse }>('/assets/search', params);
      
      // Filter out assets that are already in the current selection
      const currentIds = new Set(currentAssets.map(a => a.id));
      return response.data.assets.filter(asset => !currentIds.has(asset.id));
    },
    enabled: currentAssets.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
} 