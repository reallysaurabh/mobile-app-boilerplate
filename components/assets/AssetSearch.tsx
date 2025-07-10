import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useAssetSearchInfinite } from '@/lib/api/hooks';
import { AssetSearchParams, StockImage, Icon } from '@/lib/types/assets';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AssetSearchProps {
  onAssetSelect?: (asset: StockImage | Icon) => void;
  selectedAssets?: (StockImage | Icon)[];
  multiSelect?: boolean;
  assetType?: 'image' | 'icon' | 'all';
  orientation?: 'landscape' | 'portrait' | 'square';
  color?: string;
  category?: string;
}

export function AssetSearch({
  onAssetSelect,
  selectedAssets = [],
  multiSelect = false,
  assetType = 'all',
  orientation,
  color,
  category,
}: AssetSearchProps) {
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useState<Omit<AssetSearchParams, 'page'>>({
    query: '',
    type: assetType,
    per_page: 20,
  });
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useAssetSearchInfinite(searchParams);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setSearchParams({
        query: query.trim(),
        type: assetType,
        orientation,
        color,
        category,
        per_page: 20,
      });
    }
  }, [query, assetType, orientation, color, category]);

  const handleAssetPress = useCallback((asset: StockImage | Icon) => {
    onAssetSelect?.(asset);
  }, [onAssetSelect]);

  const isAssetSelected = useCallback((asset: StockImage | Icon) => {
    return selectedAssets.some(selected => selected.id === asset.id);
  }, [selectedAssets]);

  const allAssets = data?.pages.flatMap(page => page.assets) || [];

  const renderAsset = ({ item }: { item: StockImage | Icon }) => (
    <AssetCard
      asset={item}
      isSelected={isAssetSelected(item)}
      onPress={() => handleAssetPress(item)}
      isDark={isDark}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={isDark ? '#007AFF' : '#007AFF'} />
        <ThemedText style={styles.loadingText}>Loading more assets...</ThemedText>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const showDemoNotice = () => {
    Alert.alert(
      "Demo Mode",
      "🎭 You're seeing placeholder images for demo purposes. In production, connect real APIs (Unsplash, Pexels) for actual search results.\n\n🆓 Current sources:\n• Lorem Picsum (placeholders)\n• Built-in icon library\n• Unsplash Source (limited)",
      [{ text: "Got it!" }]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* Hero Search Section */}
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#0a0a0a'] : ['#f8f9fa', '#e9ecef']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <ThemedText style={[styles.heroTitle, { color: isDark ? '#fff' : '#000' }]}>
            Discover Assets
          </ThemedText>
          <ThemedText style={[styles.heroSubtitle, { color: isDark ? '#888' : '#666' }]}>
            Search thousands of high-quality images and icons
          </ThemedText>
          
          <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <View style={styles.searchIconContainer}>
              <Text style={[styles.searchIcon, { color: isDark ? '#666' : '#999' }]}>🔍</Text>
            </View>
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
              placeholder="Search for nature, technology, business..."
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <Pressable 
              style={[styles.searchButton, { backgroundColor: isDark ? '#007AFF' : '#007AFF' }]} 
              onPress={handleSearch}
            >
              <ThemedText style={styles.searchButtonText}>Search</ThemedText>
            </Pressable>
          </View>

          <Pressable 
            style={[styles.demoNotice, { backgroundColor: isDark ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.2)' }]} 
            onPress={showDemoNotice}
          >
            <View style={styles.demoNoticeContent}>
              <Text style={styles.demoNoticeIcon}>ℹ️</Text>
              <Text style={[styles.demoNoticeText, { color: isDark ? '#ffc107' : '#ff6b35' }]}>
                Demo Mode - Tap for info
              </Text>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Filter Bar */}
      <View style={[styles.filterBar, { backgroundColor: isDark ? '#111' : '#f8f9fa' }]}>
        <Pressable 
          style={[styles.filterChip, assetType === 'all' && styles.filterChipActive]}
          onPress={() => setSearchParams(prev => ({ ...prev, type: 'all' }))}
        >
          <ThemedText style={[styles.filterChipText, assetType === 'all' && styles.filterChipTextActive]}>
            All
          </ThemedText>
        </Pressable>
        <Pressable 
          style={[styles.filterChip, assetType === 'image' && styles.filterChipActive]}
          onPress={() => setSearchParams(prev => ({ ...prev, type: 'image' }))}
        >
          <ThemedText style={[styles.filterChipText, assetType === 'image' && styles.filterChipTextActive]}>
            📷 Images
          </ThemedText>
        </Pressable>
        <Pressable 
          style={[styles.filterChip, assetType === 'icon' && styles.filterChipActive]}
          onPress={() => setSearchParams(prev => ({ ...prev, type: 'icon' }))}
        >
          <ThemedText style={[styles.filterChipText, assetType === 'icon' && styles.filterChipTextActive]}>
            ⭐ Icons
          </ThemedText>
        </Pressable>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Searching for amazing assets...</ThemedText>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😅</Text>
          <ThemedText style={styles.errorTitle}>Oops! Something went wrong</ThemedText>
          <ThemedText style={styles.errorText}>
            {error instanceof Error ? error.message : 'Failed to search assets'}
          </ThemedText>
          <Pressable style={styles.retryButton} onPress={handleSearch}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </Pressable>
        </View>
      )}

      {/* Results Grid */}
      {allAssets.length > 0 && (
        <FlatList
          data={allAssets}
          renderItem={renderAsset}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && allAssets.length === 0 && searchParams.query && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <ThemedText style={styles.emptyTitle}>No assets found</ThemedText>
          <ThemedText style={styles.emptyText}>
            No results for "{searchParams.query}"
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Try different keywords or check your filters
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

interface AssetCardProps {
  asset: StockImage | Icon;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
}

function AssetCard({ asset, isSelected, onPress, isDark }: AssetCardProps) {
  const imageUrl = asset.type === 'image' 
    ? (asset as StockImage).thumbnailUrl || asset.url
    : asset.url;

  return (
    <Pressable
      style={[
        styles.assetCard, 
        { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        isSelected && styles.selectedCard
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.assetImage}
          contentFit="cover"
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
        
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <BlurView intensity={50} style={styles.selectedBlur}>
              <Text style={styles.selectedIcon}>✓</Text>
            </BlurView>
          </View>
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
      </View>
      
      <View style={styles.assetInfo}>
        <ThemedText style={[styles.assetTitle, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
          {asset.alt || 'Untitled'}
        </ThemedText>
        
        <View style={styles.assetMeta}>
          <View style={[styles.sourceTag, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
            <ThemedText style={[styles.sourceText, { color: isDark ? '#fff' : '#333' }]}>
              {asset.source.toUpperCase()}
            </ThemedText>
          </View>
          
          {asset.type === 'image' && (
            <ThemedText style={[styles.dimensionsText, { color: isDark ? '#888' : '#666' }]}>
              {(asset as StockImage).width}×{(asset as StockImage).height}
            </ThemedText>
          )}
        </View>

        {asset.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {asset.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}>
                <ThemedText style={[styles.tagText, { color: isDark ? '#ccc' : '#666' }]}>{tag}</ThemedText>
              </View>
            ))}
            {asset.tags.length > 2 && (
              <ThemedText style={[styles.moreTagsText, { color: isDark ? '#888' : '#999' }]}>
                +{asset.tags.length - 2}
              </ThemedText>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
        searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  searchIconContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
  },
  searchButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  demoNotice: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoNoticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoNoticeIcon: {
    fontSize: 14,
  },
  demoNoticeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  assetCard: {
    flex: 1,
    margin: 4,
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    elevation: 3,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  assetImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedBlur: {
    padding: 8,
  },
  selectedIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  assetInfo: {
    padding: 12,
  },
  assetTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  assetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dimensionsText: {
    fontSize: 11,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    fontStyle: 'italic',
  },
}); 