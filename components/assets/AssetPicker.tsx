import React from 'react';
import { Modal, View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ThemedText } from '../ThemedText';
import { AssetSearch } from './AssetSearch';
import { StockImage, Icon } from '@/lib/types/assets';
import { useColorScheme } from '@/hooks/useColorScheme';

interface AssetPickerProps {
  visible: boolean;
  onClose: () => void;
  onAssetSelect: (asset: StockImage | Icon) => void;
  selectedAssets?: (StockImage | Icon)[];
  multiSelect?: boolean;
  assetType?: 'image' | 'icon' | 'all';
  title?: string;
}

export function AssetPicker({
  visible,
  onClose,
  onAssetSelect,
  selectedAssets = [],
  multiSelect = false,
  assetType = 'all',
  title = 'Select Asset',
}: AssetPickerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAssetSelect = (asset: StockImage | Icon) => {
    onAssetSelect(asset);
    if (!multiSelect) {
      onClose();
    }
  };

  const getAssetTypeEmoji = () => {
    switch (assetType) {
      case 'image': return '📷';
      case 'icon': return '⭐';
      default: return '🎨';
    }
  };

  const getAssetTypeLabel = () => {
    switch (assetType) {
      case 'image': return 'Images';
      case 'icon': return 'Icons';
      default: return 'Assets';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        {/* Beautiful Header with Gradient */}
        <LinearGradient
          colors={isDark ? ['#1a1a1a', '#0a0a0a'] : ['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <BlurView intensity={20} style={styles.headerBlur}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.titleContainer}>
                  <View style={styles.iconContainer}>
                    <ThemedText style={styles.headerEmoji}>{getAssetTypeEmoji()}</ThemedText>
                  </View>
                  <View>
                    <ThemedText style={[styles.title, { color: '#fff' }]}>
                      Select {getAssetTypeLabel()}
                    </ThemedText>
                    <ThemedText style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>
                      Choose from thousands of assets
                    </ThemedText>
                  </View>
                </View>
              </View>
              
              <View style={styles.headerActions}>
                {multiSelect && selectedAssets.length > 0 && (
                  <Pressable style={styles.doneButton} onPress={onClose}>
                    <ThemedText style={styles.doneButtonText}>
                      Done ({selectedAssets.length})
                    </ThemedText>
                  </Pressable>
                )}
                
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <BlurView intensity={30} style={styles.closeButtonBlur}>
                    <ThemedText style={styles.closeButtonText}>✕</ThemedText>
                  </BlurView>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </LinearGradient>

        {/* Asset Search Content */}
        <View style={styles.content}>
          <AssetSearch
            onAssetSelect={handleAssetSelect}
            selectedAssets={selectedAssets}
            multiSelect={multiSelect}
            assetType={assetType}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 10,
  },
  headerBlur: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doneButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  doneButtonText: {
    color: '#667eea',
    fontWeight: '700',
    fontSize: 14,
  },
  closeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
}); 