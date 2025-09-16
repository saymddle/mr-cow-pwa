// src/script/utils/storage-helper.ts
import { Location, AppState } from '../types';
import { APP_CONSTANTS } from '../data/constants';

export class StorageHelper {
  // Generic storage methods
  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to save to localStorage:`, error);
      return false;
    }
  }

  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to read from localStorage:`, error);
      return null;
    }
  }

  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage:`, error);
      return false;
    }
  }

  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn(`Failed to clear localStorage:`, error);
      return false;
    }
  }

  // App-specific storage methods
  static saveSelectedLocation(location: Location): void {
    this.set(APP_CONSTANTS.STORAGE_KEYS.SELECTED_LOCATION, location);
  }

  static getSelectedLocation(): Location | null {
    return this.get<Location>(APP_CONSTANTS.STORAGE_KEYS.SELECTED_LOCATION);
  }

  static clearSelectedLocation(): void {
    this.remove(APP_CONSTANTS.STORAGE_KEYS.SELECTED_LOCATION);
  }

  static saveUserPreferences(preferences: UserPreferences): void {
    this.set(APP_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  static getUserPreferences(): UserPreferences {
    return this.get<UserPreferences>(APP_CONSTANTS.STORAGE_KEYS.USER_PREFERENCES) || {
      preferredLocation: null,
      defaultTipPercentage: 18,
      dietaryRestrictions: [],
      notificationsEnabled: true,
      theme: 'light'
    };
  }

  static saveOrderHistory(orders: OrderHistoryItem[]): void {
    // Only keep last 50 orders to manage storage size
    const limitedOrders = orders.slice(-50);
    this.set(APP_CONSTANTS.STORAGE_KEYS.ORDER_HISTORY, limitedOrders);
  }

  static getOrderHistory(): OrderHistoryItem[] {
    return this.get<OrderHistoryItem[]>(APP_CONSTANTS.STORAGE_KEYS.ORDER_HISTORY) || [];
  }

  static addToOrderHistory(order: OrderHistoryItem): void {
    const history = this.getOrderHistory();
    history.push(order);
    this.saveOrderHistory(history);
  }

  // PWA-specific storage for offline functionality
  static saveAppState(state: AppState): void {
    this.set('mrcow_app_state', {
      ...state,
      lastSync: new Date()
    });
  }

  static getAppState(): AppState | null {
    const state = this.get<AppState>('mrcow_app_state');
    if (state && state.lastSync) {
      state.lastSync = new Date(state.lastSync);
    }
    return state;
  }

  // Cache management for offline functionality
  static saveCachedData(key: string, data: any, expirationMinutes: number = 60): void {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expiration: Date.now() + (expirationMinutes * 60 * 1000)
    };
    this.set(`cache_${key}`, cacheItem);
  }

  static getCachedData<T>(key: string): T | null {
    const cacheItem = this.get<CacheItem<T>>(`cache_${key}`);
    
    if (!cacheItem) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() > cacheItem.expiration) {
      this.remove(`cache_${key}`);
      return null;
    }

    return cacheItem.data;
  }

  static clearCache(): void {
    // Remove all cache items
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    }
  }

  // Storage size management
  static getStorageSize(): { used: number; available: number } {
    let used = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Estimate available storage (5MB is typical localStorage limit)
    const available = 5 * 1024 * 1024 - used;
    
    return { used, available };
  }

  static isStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Export/Import functionality for data backup
  static exportData(): string {
    const data = {
      selectedLocation: this.getSelectedLocation(),
      userPreferences: this.getUserPreferences(),
      orderHistory: this.getOrderHistory(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(dataString: string): boolean {
    try {
      const data = JSON.parse(dataString);
      
      if (data.selectedLocation) {
        this.saveSelectedLocation(data.selectedLocation);
      }
      if (data.userPreferences) {
        this.saveUserPreferences(data.userPreferences);
      }
      if (data.orderHistory) {
        this.saveOrderHistory(data.orderHistory);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Type definitions for storage
interface UserPreferences {
  preferredLocation: string | null;
  defaultTipPercentage: number;
  dietaryRestrictions: string[];
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}

interface OrderHistoryItem {
  id: string;
  date: string;
  locationId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiration: number;
}
