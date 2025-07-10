import { 
  StockImage, 
  Icon, 
  AssetSearchParams, 
  AssetSearchResponse, 
  UnsplashPhoto, 
  PexelsPhoto, 
  IconifyIcon,
  AssetError 
} from '../types/assets';

// Curated demo image collection for better search results
const DEMO_IMAGE_COLLECTION = {
  nature: [
    { id: 'forest-1', keywords: ['forest', 'tree', 'green', 'nature', 'woods'], description: 'Misty forest landscape', picsum: 1015 },
    { id: 'mountain-1', keywords: ['mountain', 'landscape', 'nature', 'sky', 'peak'], description: 'Mountain peak at sunrise', picsum: 1018 },
    { id: 'ocean-1', keywords: ['ocean', 'sea', 'water', 'blue', 'waves'], description: 'Ocean waves crashing', picsum: 1022 },
    { id: 'flower-1', keywords: ['flower', 'bloom', 'nature', 'colorful', 'garden'], description: 'Colorful wildflowers', picsum: 1061 },
    { id: 'sunset-1', keywords: ['sunset', 'sun', 'sky', 'nature', 'golden'], description: 'Golden sunset over lake', picsum: 1073 },
    { id: 'waterfall-1', keywords: ['waterfall', 'water', 'nature', 'rocks'], description: 'Cascading waterfall', picsum: 433 },
  ],
  animals: [
    { id: 'cat-1', keywords: ['cat', 'pet', 'animal', 'cute', 'feline'], description: 'Adorable orange cat', picsum: 1074 },
    { id: 'dog-1', keywords: ['dog', 'pet', 'animal', 'cute', 'canine'], description: 'Happy golden retriever', picsum: 1025 },
    { id: 'bird-1', keywords: ['bird', 'animal', 'wildlife', 'flying'], description: 'Bird in flight', picsum: 1069 },
    { id: 'butterfly-1', keywords: ['butterfly', 'insect', 'colorful', 'nature'], description: 'Colorful butterfly', picsum: 1063 },
    { id: 'ant-1', keywords: ['ant', 'insect', 'bug', 'tiny', 'worker'], description: 'Ant carrying food', picsum: 1070 },
    { id: 'elephant-1', keywords: ['elephant', 'animal', 'wildlife', 'large'], description: 'Majestic elephant', picsum: 1071 },
  ],
  technology: [
    { id: 'laptop-1', keywords: ['laptop', 'computer', 'technology', 'work'], description: 'Modern laptop on desk', picsum: 1181 },
    { id: 'phone-1', keywords: ['phone', 'mobile', 'smartphone', 'technology'], description: 'Smartphone with apps', picsum: 1051 },
    { id: 'coding-1', keywords: ['code', 'programming', 'developer', 'screen'], description: 'Code on screen', picsum: 1194 },
    { id: 'robot-1', keywords: ['robot', 'ai', 'artificial', 'intelligence'], description: 'Futuristic robot', picsum: 1065 },
    { id: 'circuit-1', keywords: ['circuit', 'electronics', 'technology', 'board'], description: 'Circuit board close-up', picsum: 1066 },
  ],
  business: [
    { id: 'office-1', keywords: ['office', 'business', 'work', 'corporate'], description: 'Modern office space', picsum: 1072 },
    { id: 'meeting-1', keywords: ['meeting', 'business', 'teamwork', 'discussion'], description: 'Business meeting', picsum: 1180 },
    { id: 'handshake-1', keywords: ['handshake', 'business', 'deal', 'partnership'], description: 'Professional handshake', picsum: 1184 },
    { id: 'chart-1', keywords: ['chart', 'graph', 'data', 'analytics'], description: 'Business analytics', picsum: 1067 },
  ],
  food: [
    { id: 'pizza-1', keywords: ['pizza', 'food', 'italian', 'delicious'], description: 'Fresh pizza slice', picsum: 1080 },
    { id: 'coffee-1', keywords: ['coffee', 'drink', 'cafe', 'morning'], description: 'Perfect coffee cup', picsum: 1058 },
    { id: 'salad-1', keywords: ['salad', 'healthy', 'vegetables', 'fresh'], description: 'Fresh garden salad', picsum: 1059 },
    { id: 'fruit-1', keywords: ['fruit', 'healthy', 'colorful', 'fresh'], description: 'Colorful fruit bowl', picsum: 1060 },
  ],
  travel: [
    { id: 'city-1', keywords: ['city', 'urban', 'skyline', 'buildings'], description: 'Modern city skyline', picsum: 1190 },
    { id: 'beach-1', keywords: ['beach', 'vacation', 'sand', 'tropical'], description: 'Tropical beach paradise', picsum: 1076 },
    { id: 'bridge-1', keywords: ['bridge', 'architecture', 'travel', 'landmark'], description: 'Iconic bridge view', picsum: 1077 },
    { id: 'road-1', keywords: ['road', 'travel', 'journey', 'adventure'], description: 'Open road adventure', picsum: 1078 },
  ]
};

class AssetService {
  private readonly UNSPLASH_API_URL = 'https://api.unsplash.com';
  private readonly PEXELS_API_URL = 'https://api.pexels.com/v1';
  
  // Free sources - no API keys required!
  private readonly LOREM_PICSUM_URL = 'https://picsum.photos';
  private readonly UNSPLASH_SOURCE_URL = 'https://source.unsplash.com';
  
  private unsplashKey?: string;
  private pexelsKey?: string;

  constructor() {
    // Keys will be provided via environment variables
    this.unsplashKey = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY;
    this.pexelsKey = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
  }

  async searchImages(params: AssetSearchParams): Promise<AssetSearchResponse> {
    const results: (StockImage | Icon)[] = [];
    let total = 0;
    
    try {
      // Search images if requested
      if (params.type === 'image' || params.type === 'all') {
        // Always available - Curated demo images (relevant results!)
        try {
          const curatedResults = await this.searchCuratedImages(params);
          results.push(...curatedResults.assets);
          total += curatedResults.total;
        } catch (error) {
          console.warn('Curated images failed:', error);
        }

        // Always available - themed images
        try {
          const themedResults = await this.searchThemedImages(params);
          results.push(...themedResults.assets);
          total += themedResults.total;
        } catch (error) {
          console.warn('Themed images failed:', error);
        }

        // Always available - Unsplash Source (limited but free)
        try {
          const unsplashSourceResults = await this.searchUnsplashSource(params);
          results.push(...unsplashSourceResults.assets);
          total += unsplashSourceResults.total;
        } catch (error) {
          console.warn('Unsplash Source failed:', error);
        }

        // Optional - Unsplash API (requires key)
        if (this.unsplashKey) {
          try {
            const unsplashResults = await this.searchUnsplash(params);
            results.push(...unsplashResults.assets);
            total += unsplashResults.total;
          } catch (error) {
            console.warn('Unsplash API failed:', error);
          }
        }

        // Optional - Pexels API (requires key)
        if (this.pexelsKey) {
          try {
            const pexelsResults = await this.searchPexels(params);
            results.push(...pexelsResults.assets);
            total += pexelsResults.total;
          } catch (error) {
            console.warn('Pexels API failed:', error);
          }
        }
      }

      // Search icons if requested
      if (params.type === 'icon' || params.type === 'all') {
        try {
          const iconResults = await this.searchSimpleIcons(params);
          results.push(...iconResults.assets);
          total += iconResults.total;
        } catch (error) {
          console.warn('Icon search failed:', error);
        }
      }

      return {
        assets: results,
        total,
        totalPages: Math.ceil(total / (params.per_page || 20)),
        currentPage: params.page || 1,
        hasMore: results.length === (params.per_page || 20)
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // NEW: Curated demo images with relevant search results
  private async searchCuratedImages(params: AssetSearchParams): Promise<AssetSearchResponse> {
    const query = params.query.toLowerCase();
    const perPage = Math.min(params.per_page || 20, 12);
    const page = params.page || 1;
    
    // Find matching images from our curated collection
    const allImages = Object.values(DEMO_IMAGE_COLLECTION).flat();
    const matchingImages = allImages.filter(img => 
      img.keywords.some(keyword => 
        keyword.includes(query) || query.includes(keyword)
      )
    );

    // If no matches, try fuzzy matching
    if (matchingImages.length === 0) {
      const fuzzyMatches = allImages.filter(img => 
        img.keywords.some(keyword => {
          const similarity = this.calculateSimilarity(keyword, query);
          return similarity > 0.6; // 60% similarity threshold
        })
      );
      matchingImages.push(...fuzzyMatches);
    }

    // Sort by relevance (exact matches first)
    matchingImages.sort((a, b) => {
      const aExactMatch = a.keywords.some(k => k === query);
      const bExactMatch = b.keywords.some(k => k === query);
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedImages = matchingImages.slice(startIndex, endIndex);

    // Convert to StockImage format
    const images: StockImage[] = paginatedImages.map((img, index) => {
      const width = 800;
      const height = params.orientation === 'portrait' ? 1200 : 
                   params.orientation === 'square' ? 800 : 600;
      
      const baseUrl = `${this.LOREM_PICSUM_URL}`;
      const imageUrl = `${baseUrl}/${width}/${height}?random=${img.picsum}`;
      
      return {
        id: `curated-${img.id}`,
        type: 'image',
        url: imageUrl,
        thumbnailUrl: `${baseUrl}/200/150?random=${img.picsum}`,
        previewUrl: `${baseUrl}/400/300?random=${img.picsum}`,
        alt: img.description,
        tags: [...img.keywords, 'curated', 'demo'],
        source: 'curated-demo',
        width,
        height,
        aspectRatio: width / height,
        downloadUrl: imageUrl,
        sizes: {
          small: `${baseUrl}/400/300?random=${img.picsum}`,
          medium: imageUrl,
          large: `${baseUrl}/${width * 1.5}/${height * 1.5}?random=${img.picsum}`,
          original: `${baseUrl}/${width * 2}/${height * 2}?random=${img.picsum}`
        },
        colors: ['#888888'],
        attribution: `Demo: ${img.description}`,
        license: 'Free for demo purposes'
      };
    });

    return {
      assets: images,
      total: matchingImages.length,
      totalPages: Math.ceil(matchingImages.length / perPage),
      currentPage: page,
      hasMore: endIndex < matchingImages.length
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private async searchUnsplash(params: AssetSearchParams): Promise<AssetSearchResponse> {
    if (!this.unsplashKey) {
      return { assets: [], total: 0, totalPages: 0, currentPage: 1, hasMore: false };
    }

    const url = new URL(`${this.UNSPLASH_API_URL}/search/photos`);
    url.searchParams.append('query', params.query);
    url.searchParams.append('per_page', String(params.per_page || 20));
    url.searchParams.append('page', String(params.page || 1));
    
    if (params.orientation) {
      url.searchParams.append('orientation', params.orientation);
    }
    if (params.color) {
      url.searchParams.append('color', params.color);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${this.unsplashKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    const images: StockImage[] = data.results.map((photo: UnsplashPhoto) => 
      this.transformUnsplashPhoto(photo)
    );

    return {
      assets: images,
      total: data.total,
      totalPages: data.total_pages,
      currentPage: params.page || 1,
      hasMore: (params.page || 1) < data.total_pages
    };
  }

  private async searchPexels(params: AssetSearchParams): Promise<AssetSearchResponse> {
    if (!this.pexelsKey) {
      return { assets: [], total: 0, totalPages: 0, currentPage: 1, hasMore: false };
    }

    const url = new URL(`${this.PEXELS_API_URL}/search`);
    url.searchParams.append('query', params.query);
    url.searchParams.append('per_page', String(params.per_page || 20));
    url.searchParams.append('page', String(params.page || 1));

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': this.pexelsKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    const images: StockImage[] = data.photos.map((photo: PexelsPhoto) => 
      this.transformPexelsPhoto(photo)
    );

    return {
      assets: images,
      total: data.total_results,
      totalPages: Math.ceil(data.total_results / (params.per_page || 20)),
      currentPage: params.page || 1,
      hasMore: data.next_page !== undefined
    };
  }

  // FREE SOURCE: Generate simple icon collection
  private async searchSimpleIcons(params: AssetSearchParams): Promise<AssetSearchResponse> {
    const perPage = Math.min(params.per_page || 20, 20);
    const page = params.page || 1;
    const icons: Icon[] = [];

    // Create a collection of simple, themed icons based on search query
    const iconCategories = [
      'arrow', 'check', 'close', 'home', 'user', 'settings', 'search', 'heart',
      'star', 'plus', 'minus', 'edit', 'delete', 'save', 'share', 'download',
      'upload', 'refresh', 'play', 'pause', 'stop', 'next', 'previous',
      'volume', 'mute', 'wifi', 'battery', 'location', 'calendar', 'clock',
      'mail', 'phone', 'message', 'camera', 'image', 'video', 'file', 'folder'
    ];

    // Filter icons based on search query
    const matchingCategories = iconCategories.filter(category => 
      category.includes(params.query.toLowerCase()) || 
      params.query.toLowerCase().includes(category)
    );

    // If no direct matches, include all categories for demo
    const categoriesToUse = matchingCategories.length > 0 ? matchingCategories : iconCategories;
    
    // Generate icons for the current page
    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, categoriesToUse.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      const category = categoriesToUse[i];
      const iconSvg = this.generateSimpleIconSvg(category);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`;
      
      const icon: Icon = {
        id: `icon-${category}-${i}`,
        type: 'icon',
        url: svgDataUrl,
        alt: `${category} icon`,
        tags: [category, 'icon', 'simple', params.query],
        source: 'simple-icons',
        category: 'general',
        style: 'outline',
        format: 'svg',
        sizes: [24],
        vectorUrl: svgDataUrl,
        downloadUrls: {
          svg: svgDataUrl
        },
        attribution: 'Built-in icon collection',
        license: 'Free for commercial and personal use'
      };
      icons.push(icon);
    }

    return {
      assets: icons,
      total: categoriesToUse.length,
      totalPages: Math.ceil(categoriesToUse.length / perPage),
      currentPage: page,
      hasMore: endIndex < categoriesToUse.length
    };
  }

  async getIconSvg(prefix: string, name: string): Promise<string> {
    // For simple icons, generate SVG on the fly
    if (prefix === 'simple') {
      return this.generateSimpleIconSvg(name);
    }
    
    // Default fallback
    return this.generateSimpleIconSvg('default');
  }

  async downloadImage(imageUrl: string, filename?: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    return response.blob();
  }

  private transformUnsplashPhoto(photo: UnsplashPhoto): StockImage {
    return {
      id: photo.id,
      type: 'image',
      url: photo.urls.regular,
      thumbnailUrl: photo.urls.thumb,
      previewUrl: photo.urls.small,
      alt: photo.alt_description || '',
      tags: photo.tags?.map(tag => tag.title) || [],
      source: 'unsplash',
      width: photo.width,
      height: photo.height,
      aspectRatio: photo.width / photo.height,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      downloadUrl: photo.links.download,
      sizes: {
        small: photo.urls.small,
        medium: photo.urls.regular,
        large: photo.urls.full,
        original: photo.urls.raw
      },
      colors: [photo.color],
      description: photo.description || undefined,
      attribution: `Photo by ${photo.user.name} on Unsplash`,
      license: 'Unsplash License'
    };
  }

  private transformPexelsPhoto(photo: PexelsPhoto): StockImage {
    return {
      id: String(photo.id),
      type: 'image',
      url: photo.src.large,
      thumbnailUrl: photo.src.small,
      previewUrl: photo.src.medium,
      alt: photo.alt,
      tags: [],
      source: 'pexels',
      width: photo.width,
      height: photo.height,
      aspectRatio: photo.width / photo.height,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      downloadUrl: photo.src.original,
      sizes: {
        small: photo.src.small,
        medium: photo.src.medium,
        large: photo.src.large,
        original: photo.src.original
      },
      colors: [photo.avg_color],
      attribution: `Photo by ${photo.photographer} on Pexels`,
      license: 'Pexels License'
    };
  }

  private handleError(error: unknown): AssetError {
    if (error instanceof Error) {
      return {
        code: 'ASSET_SERVICE_ERROR',
        message: error.message,
        details: error
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred while fetching assets',
      details: error
    };
  }

  // Utility methods for asset management
  generateAssetFilename(asset: StockImage | Icon, extension?: string): string {
    const sanitizedAlt = asset.alt?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'asset';
    const timestamp = Date.now();
    const ext = extension || (asset.type === 'icon' ? 'svg' : 'jpg');
    
    return `${sanitizedAlt}-${asset.id}-${timestamp}.${ext}`;
  }

  getOptimalImageSize(asset: StockImage, maxWidth: number, maxHeight: number): string {
    const { sizes, width, height } = asset;
    
    // Calculate which size fits best within the constraints
    if (width <= maxWidth && height <= maxHeight) {
      return sizes.original;
    } else if (width <= maxWidth * 1.5 && height <= maxHeight * 1.5) {
      return sizes.large;
    } else if (width <= maxWidth * 2 && height <= maxHeight * 2) {
      return sizes.medium;
    } else {
      return sizes.small;
    }
  }

  // FREE SOURCE: Lorem Picsum - Beautiful placeholder images
  private async searchLoremPicsum(params: AssetSearchParams): Promise<AssetSearchResponse> {
    const perPage = Math.min(params.per_page || 20, 10); // Limit for demo
    const page = params.page || 1;
    const images: StockImage[] = [];

    // Generate Lorem Picsum images based on search query
    for (let i = 0; i < perPage; i++) {
      const imageId = (page - 1) * perPage + i + 1;
      const width = 800;
      const height = params.orientation === 'portrait' ? 1200 : 
                   params.orientation === 'square' ? 800 : 600;
      
      const baseUrl = `${this.LOREM_PICSUM_URL}`;
      const image: StockImage = {
        id: `lorem-${imageId}`,
        type: 'image',
        url: `${baseUrl}/${width}/${height}?random=${imageId}`,
        thumbnailUrl: `${baseUrl}/200/150?random=${imageId}`,
        previewUrl: `${baseUrl}/400/300?random=${imageId}`,
        alt: `${params.query} stock photo ${imageId}`,
        tags: [params.query, 'stock', 'free', 'lorem-picsum'],
        source: 'lorem-picsum',
        width,
        height,
        aspectRatio: width / height,
        downloadUrl: `${baseUrl}/${width}/${height}?random=${imageId}`,
        sizes: {
          small: `${baseUrl}/400/300?random=${imageId}`,
          medium: `${baseUrl}/${width}/${height}?random=${imageId}`,
          large: `${baseUrl}/${width * 1.5}/${height * 1.5}?random=${imageId}`,
          original: `${baseUrl}/${width * 2}/${height * 2}?random=${imageId}`
        },
        colors: ['#888888'],
        attribution: 'Provided by Lorem Picsum',
        license: 'Free for commercial and personal use'
      };
      images.push(image);
    }

    return {
      assets: images,
      total: 1000, // Large number for demo
      totalPages: 100,
      currentPage: page,
      hasMore: page < 100
    };
  }

  // FREE SOURCE: Generate themed placeholder images
  private async searchThemedImages(params: AssetSearchParams): Promise<AssetSearchResponse> {
    const perPage = Math.min(params.per_page || 20, 10);
    const page = params.page || 1;
    const images: StockImage[] = [];

    // Create themed placeholder images based on search query
    for (let i = 0; i < perPage; i++) {
      const imageId = (page - 1) * perPage + i + 100; // Offset to avoid conflicts
      const width = 800;
      const height = params.orientation === 'portrait' ? 1200 : 
                   params.orientation === 'square' ? 800 : 600;
      
      // Use Lorem Picsum with different parameters for variety
      const baseUrl = `https://picsum.photos`;
      const seedParam = `${params.query.replace(/\s+/g, '')}-${imageId}`;
      
      const image: StockImage = {
        id: `themed-${imageId}`,
        type: 'image',
        url: `${baseUrl}/${width}/${height}?random=${seedParam}`,
        thumbnailUrl: `${baseUrl}/200/150?random=${seedParam}`,
        previewUrl: `${baseUrl}/400/300?random=${seedParam}`,
        alt: `${params.query} themed photo ${imageId}`,
        tags: [params.query, 'stock', 'free', 'themed'],
        source: 'themed-source',
        width,
        height,
        aspectRatio: width / height,
        downloadUrl: `${baseUrl}/${width}/${height}?random=${seedParam}`,
        sizes: {
          small: `${baseUrl}/400/300?random=${seedParam}`,
          medium: `${baseUrl}/${width}/${height}?random=${seedParam}`,
          large: `${baseUrl}/${width * 1.5}/${height * 1.5}?random=${seedParam}`,
          original: `${baseUrl}/${width * 2}/${height * 2}?random=${seedParam}`
        },
        colors: ['#777777'],
        attribution: 'Free themed stock photo',
        license: 'Free for commercial and personal use'
      };
      images.push(image);
    }

    return {
      assets: images,
      total: 800,
      totalPages: 80,
      currentPage: page,
      hasMore: page < 80
    };
  }

  // FREE SOURCE: Unsplash Source (limited but free)
  private async searchUnsplashSource(params: AssetSearchParams): Promise<AssetSearchResponse> {
    const perPage = Math.min(params.per_page || 20, 8); // Limited for free tier
    const images: StockImage[] = [];

    // Generate Unsplash Source images
    for (let i = 0; i < perPage; i++) {
      const imageId = (params.page || 1) * 1000 + i;
      const width = 800;
      const height = params.orientation === 'portrait' ? 1200 : 
                   params.orientation === 'square' ? 800 : 600;
      
      const queryUrl = `${this.UNSPLASH_SOURCE_URL}/${width}x${height}/?${params.query}`;
      
      const image: StockImage = {
        id: `unsplash-source-${imageId}`,
        type: 'image',
        url: queryUrl,
        thumbnailUrl: `${this.UNSPLASH_SOURCE_URL}/200x150/?${params.query}`,
        previewUrl: `${this.UNSPLASH_SOURCE_URL}/400x300/?${params.query}`,
        alt: `${params.query} from Unsplash`,
        tags: [params.query, 'unsplash', 'free', 'stock'],
        source: 'unsplash-source',
        width,
        height,
        aspectRatio: width / height,
        downloadUrl: queryUrl,
        sizes: {
          small: `${this.UNSPLASH_SOURCE_URL}/400x300/?${params.query}`,
          medium: queryUrl,
          large: `${this.UNSPLASH_SOURCE_URL}/${width * 1.5}x${height * 1.5}/?${params.query}`,
          original: `${this.UNSPLASH_SOURCE_URL}/${width * 2}x${height * 2}/?${params.query}`
        },
        colors: ['#999999'],
        attribution: 'Photo from Unsplash Source',
        license: 'Unsplash License'
      };
      images.push(image);
    }

    return {
      assets: images,
      total: 500,
      totalPages: 50,
      currentPage: params.page || 1,
      hasMore: (params.page || 1) < 50
    };
  }

  // Generate simple SVG icons
  private generateSimpleIconSvg(iconName: string): string {
    const iconMap: Record<string, string> = {
      arrow: '<path d="M5 12h14m-7-7l7 7-7 7"/>',
      check: '<path d="M20 6L9 17l-5-5"/>',
      close: '<path d="M18 6L6 18M6 6l12 12"/>',
      home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>',
      user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
      heart: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
      star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
      plus: '<path d="M12 5v14m-7-7h14"/>',
      minus: '<path d="M5 12h14"/>',
      edit: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      delete: '<polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>',
      save: '<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>',
      share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98"/>',
      download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5m-5-5v12"/>',
      upload: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-7l5-5 5 5m-5 10V3"/>',
      default: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8m-4-4v8"/>'
    };

    const pathData = iconMap[iconName] || iconMap.default;
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${pathData}
    </svg>`;
  }
}

export const assetService = new AssetService(); 