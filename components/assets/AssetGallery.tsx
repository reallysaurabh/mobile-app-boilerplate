import React from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useDownloadAsset } from '@/lib/api/hooks';
import { StockImage, Icon } from '@/lib/types/assets';

interface AssetGalleryProps {
  assets: (StockImage | Icon)[];
  onRemoveAsset?: (asset: StockImage | Icon) => void;
  onAssetPress?: (asset: StockImage | Icon) => void;
  showDownload?: boolean;
  showRemove?: boolean;
  numColumns?: number;
}

export function AssetGallery({
  assets,
  onRemoveAsset,
  onAssetPress,
  showDownload = true,
  showRemove = true,
  numColumns = 3,
}: AssetGalleryProps) {
  const downloadAsset = useDownloadAsset();

  const handleDownload = async (asset: StockImage | Icon) => {
    try {
      const downloadUrl = asset.type === 'image' 
        ? (asset as StockImage).downloadUrl 
        : asset.url;
      
      const filename = asset.type === 'image'
        ? `${asset.alt || 'image'}-${asset.id}.jpg`
        : `${asset.alt || 'icon'}-${asset.id}.svg`;

      await downloadAsset.mutateAsync({
        url: downloadUrl,
        filename,
      });
    } catch (error) {
      Alert.alert('Download Error', 'Failed to download asset');
    }
  };

  const handleRemove = (asset: StockImage | Icon) => {
    Alert.alert(
      'Remove Asset',
      'Are you sure you want to remove this asset?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onRemoveAsset?.(asset) },
      ]
    );
  };

  const renderAsset = ({ item }: { item: StockImage | Icon }) => (
    <AssetGalleryItem
      asset={item}
      onPress={() => onAssetPress?.(item)}
      onDownload={() => handleDownload(item)}
      onRemove={() => handleRemove(item)}
      showDownload={showDownload}
      showRemove={showRemove}
      isDownloading={downloadAsset.isPending}
    />
  );

  if (assets.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No assets selected</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Use the asset picker to add images and icons
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          Selected Assets ({assets.length})
        </ThemedText>
      </View>

      <FlatList
        data={assets}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

interface AssetGalleryItemProps {
  asset: StockImage | Icon;
  onPress?: () => void;
  onDownload?: () => void;
  onRemove?: () => void;
  showDownload: boolean;
  showRemove: boolean;
  isDownloading: boolean;
}

function AssetGalleryItem({
  asset,
  onPress,
  onDownload,
  onRemove,
  showDownload,
  showRemove,
  isDownloading,
}: AssetGalleryItemProps) {
  const imageUrl = asset.type === 'image' 
    ? (asset as StockImage).thumbnailUrl || asset.url
    : asset.url;

  return (
    <View style={styles.assetItem}>
      <Pressable style={styles.assetCard} onPress={onPress}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.assetImage}
          contentFit="cover"
        />
        
        <View style={styles.assetOverlay}>
          <View style={styles.sourceTag}>
            <ThemedText style={styles.sourceText}>
              {asset.source.toUpperCase()}
            </ThemedText>
          </View>
        </View>
      </Pressable>

      <View style={styles.assetInfo}>
        <ThemedText style={styles.assetTitle} numberOfLines={1}>
          {asset.alt || 'Untitled'}
        </ThemedText>
        
        {asset.type === 'image' && (
          <ThemedText style={styles.dimensionsText}>
            {(asset as StockImage).width}×{(asset as StockImage).height}
          </ThemedText>
        )}
      </View>

      <View style={styles.actions}>
        {showDownload && (
          <Pressable
            style={[styles.actionButton, styles.downloadButton]}
            onPress={onDownload}
            disabled={isDownloading}
          >
            <ThemedText style={styles.actionButtonText}>
              {isDownloading ? '⏳' : '⬇️'}
            </ThemedText>
          </Pressable>
        )}

        {showRemove && (
          <Pressable
            style={[styles.actionButton, styles.removeButton]}
            onPress={onRemove}
          >
            <ThemedText style={styles.actionButtonText}>✕</ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  grid: {
    padding: 16,
    gap: 16,
  },
  assetItem: {
    flex: 1,
    margin: 4,
    maxWidth: '31%',
  },
  assetCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  assetImage: {
    width: '100%',
    height: 80,
  },
  assetOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  sourceTag: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sourceText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  assetInfo: {
    marginTop: 4,
  },
  assetTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  dimensionsText: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#34C759',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 