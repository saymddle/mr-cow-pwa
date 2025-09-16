// src/script/data/constants.ts
import { MenuCategory } from '../types';

export const APP_CONSTANTS = {
  // App Information
  APP_NAME: 'Mr. Cow Corndog',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Authentic Korean Street Food - Order from your local Mr. Cow franchise',
  
  // Brand Colors
  BRAND_COLORS: {
    PRIMARY_ORANGE: '#FF6B35',
    SECONDARY_RED: '#D32F2F',
    ACCENT_YELLOW: '#FFB74D',
    TEXT_DARK: '#2C2C2C',
    TEXT_LIGHT: '#757575',
    BACKGROUND: '#FAFAFA',
    WHITE: '#FFFFFF'
  },

  // Business Settings
  TAX_RATE: 0.08875, // Default tax rate
  DEFAULT_TIP_PERCENTAGES: [15, 18, 20, 25],
  ORDER_PREPARATION_TIME: 15, // minutes
  
  // Local Storage Keys
  STORAGE_KEYS: {
    SELECTED_LOCATION: 'mrcow_selected_location',
    CART_DATA: 'mrcow_cart',
    USER_PREFERENCES: 'mrcow_user_prefs',
    ORDER_HISTORY: 'mrcow_order_history'
  },

  // Menu Categories Display Names
  CATEGORY_NAMES: {
    [MenuCategory.CORNDOGS]: 'Korean Corndogs',
    [MenuCategory.KOREAN_FRIED_CHICKEN]: 'Korean Fried Chicken',
    [MenuCategory.RICE_BOWLS]: 'Rice Bowls',
    [MenuCategory.NOODLES]: 'Korean Noodles',
    [MenuCategory.SIDES]: 'Sides & Appetizers',
    [MenuCategory.DESSERTS]: 'Korean Desserts',
    [MenuCategory.BEVERAGES]: 'Korean Beverages',
    [MenuCategory.SPECIALS]: 'Daily Specials'
  }
};
