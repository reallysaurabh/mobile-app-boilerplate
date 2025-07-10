import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Custom storage adapter that works across platforms and handles SSR
const createCustomStorage = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        if (Platform.OS === 'web') {
          // On web, use localStorage if available (client-side)
          if (isBrowser && window.localStorage) {
            return window.localStorage.getItem(key);
          }
          // During SSR, return null
          return null;
        } else {
          // On mobile, use AsyncStorage
          return await AsyncStorage.getItem(key);
        }
      } catch (error) {
        console.warn('Storage getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        if (Platform.OS === 'web') {
          // On web, use localStorage if available (client-side)
          if (isBrowser && window.localStorage) {
            window.localStorage.setItem(key, value);
          }
          // During SSR, do nothing
        } else {
          // On mobile, use AsyncStorage
          await AsyncStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn('Storage setItem error:', error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        if (Platform.OS === 'web') {
          // On web, use localStorage if available (client-side)
          if (isBrowser && window.localStorage) {
            window.localStorage.removeItem(key);
          }
          // During SSR, do nothing
        } else {
          // On mobile, use AsyncStorage
          await AsyncStorage.removeItem(key);
        }
      } catch (error) {
        console.warn('Storage removeItem error:', error);
      }
    },
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 