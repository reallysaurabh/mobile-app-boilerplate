import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AssetPicker, AssetGallery } from '@/components/assets';
import { StockImage, Icon } from '@/lib/types/assets';
import { Platform } from 'react-native';

export default function AssetsDemoScreen() {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<(StockImage | Icon)[]>([]);

  const handleAssetSelect = (asset: StockImage | Icon) => {
    setSelectedAssets(prev => {
      const exists = prev.find(item => item.id === asset.id);
      if (exists) {
        return prev.filter(item => item.id !== asset.id);
      } else {
        return [...prev, asset];
      }
    });
  };

  const handleRemoveAsset = (asset: StockImage | Icon) => {
    setSelectedAssets(prev => prev.filter(item => item.id !== asset.id));
  };

  const GradientButton = ({ title, icon, onPress, gradient, style }: any) => (
    <Pressable 
      style={({ pressed }) => [
        styles.gradientButton,
        style,
        { opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={onPress}
    >
      <View style={styles.gradientButtonInner}>
        <Text style={styles.gradientButtonText}>
          {icon} {title}
        </Text>
      </View>
    </Pressable>
  );

  const FeatureCard = ({ icon, title, description, type = 'free' }: any) => (
    <View style={[styles.featureCard, type === 'premium' && styles.premiumCard]}>
      <View style={styles.featureIconContainer}>
        <Text style={styles.featureIcon}>{icon}</Text>
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, type === 'premium' && styles.premiumText]}>
          {title}
        </Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      {type === 'premium' && <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>PRO</Text></View>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Beautiful gradient background */}
      <View style={styles.backgroundGradient} />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>🎨 Asset Studio</Text>
            <Text style={styles.heroSubtitle}>
              Discover stunning stock images & icons
            </Text>
            <Text style={styles.heroDescription}>
              Professional quality assets from multiple sources, completely free to use
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>🚀 Quick Start</Text>
          
          <GradientButton
            title="Browse Stock Images"
            icon="🖼️"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            onPress={() => setShowImagePicker(true)}
            style={styles.primaryButton}
          />
          
          <GradientButton
            title="Browse Icons"
            icon="⭐"
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            onPress={() => setShowIconPicker(true)}
            style={styles.secondaryButton}
          />
        </View>

        {/* Free Sources Grid */}
        <View style={styles.sourcesContainer}>
          <Text style={styles.sectionTitle}>🌟 Free Sources</Text>
          <Text style={styles.sectionSubtitle}>Zero setup required • Commercial use allowed</Text>
          
          <View style={styles.sourcesGrid}>
            <FeatureCard
              icon="🎯"
              title="Lorem Picsum"
              description="Beautiful placeholder images"
              type="free"
            />
            <FeatureCard
              icon="🖼️"
              title="Themed Images"
              description="Custom generated visuals"
              type="free"
            />
            <FeatureCard
              icon="📸"
              title="Unsplash Source"
              description="Quality photography"
              type="free"
            />
            <FeatureCard
              icon="🎨"
              title="Icon Collection"
              description="35+ built-in icons"
              type="free"
            />
            <FeatureCard
              icon="🌟"
              title="Unsplash API"
              description="Premium quality photos"
              type="premium"
            />
            <FeatureCard
              icon="📱"
              title="Pexels API"
              description="More variety & styles"
              type="premium"
            />
          </View>
        </View>

        {/* Features Showcase */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>✨ Powerful Features</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🔍</Text>
              <Text style={styles.featureText}>Smart Search</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>⬇️</Text>
              <Text style={styles.featureText}>Download</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🎯</Text>
              <Text style={styles.featureText}>Filters</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>♾️</Text>
              <Text style={styles.featureText}>Infinite Scroll</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📱</Text>
              <Text style={styles.featureText}>Mobile First</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>⚡</Text>
              <Text style={styles.featureText}>Fast Cache</Text>
            </View>
          </View>
        </View>

        {/* Setup Instructions */}
        <View style={styles.setupContainer}>
          <Text style={styles.sectionTitle}>🛠️ Optional Setup</Text>
          <Text style={styles.setupDescription}>
            For premium features, add these free API keys:
          </Text>
          
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              # Add to .env.local{'\n'}
              EXPO_PUBLIC_UNSPLASH_ACCESS_KEY=your_key{'\n'}
              EXPO_PUBLIC_PEXELS_API_KEY=your_key
            </Text>
          </View>
          
          <View style={styles.setupNote}>
            <Text style={styles.setupNoteText}>
              💡 Both APIs are completely free from their websites
            </Text>
          </View>
        </View>

        {/* Selected Assets */}
        {selectedAssets.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.sectionTitle}>
              📁 Selected Assets ({selectedAssets.length})
            </Text>
            <AssetGallery
              assets={selectedAssets}
              onRemoveAsset={handleRemoveAsset}
              showDownload={true}
              showRemove={true}
            />
          </View>
        )}
      </ScrollView>

      <AssetPicker
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onAssetSelect={handleAssetSelect}
        selectedAssets={selectedAssets}
        multiSelect={true}
        assetType="image"
        title="Select Stock Images"
      />

      <AssetPicker
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onAssetSelect={handleAssetSelect}
        selectedAssets={selectedAssets}
        multiSelect={true}
        assetType="icon"
        title="Select Icons"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Hero Section
  heroSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  heroContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    elevation: 10,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#667eea',
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Quick Actions
  quickActionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  gradientButton: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    elevation: 8,
  },
  gradientButtonInner: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  gradientButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryButton: {
    // Additional styling for primary button
  },
  secondaryButton: {
    // Additional styling for secondary button
  },

  // Sources Grid
  sourcesContainer: {
    marginBottom: 32,
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    elevation: 6,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: '#f093fb',
    backgroundColor: 'rgba(240,147,251,0.1)',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(102,126,234,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  premiumText: {
    color: '#f5576c',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f5576c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Features Grid
  featuresContainer: {
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    elevation: 4,
  },
  featureEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },

  // Setup Section
  setupContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    elevation: 8,
  },
  setupDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  codeBlock: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: 'Monaco, Consolas, "Courier New", monospace',
    }),
    fontSize: 14,
    color: '#68d391',
    lineHeight: 20,
  },
  setupNote: {
    backgroundColor: 'rgba(104, 211, 145, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#68d391',
  },
  setupNoteText: {
    fontSize: 14,
    color: '#38a169',
    fontWeight: '500',
  },

  // Selected Assets
  selectedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    elevation: 8,
  },
}); 