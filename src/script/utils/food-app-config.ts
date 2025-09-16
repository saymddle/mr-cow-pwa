// src/script/utils/food-app-config.ts
import { APP_CONSTANTS } from '../data/constants';

export class FoodAppConfig {
  // PWA Configuration for food ordering app
  static getPWAConfig() {
    return {
      name: APP_CONSTANTS.APP_NAME,
      shortName: 'Mr. Cow',
      description: APP_CONSTANTS.APP_DESCRIPTION,
      version: APP_CONSTANTS.APP_VERSION,
      themeColor: APP_CONSTANTS.BRAND_COLORS.PRIMARY_ORANGE,
      backgroundColor: APP_CONSTANTS.BRAND_COLORS.WHITE,
      display: 'standalone',
      orientation: 'portrait-primary',
      startUrl: '/',
      scope: '/',
      
      // Food ordering specific shortcuts
      shortcuts: [
        {
          name: 'Order Now',
          shortName: 'Order',
          description: 'Start a new food order',
          url: '/order',
          icons: [{ src: '/assets/icons/order-icon-96x96.png', sizes: '96x96' }]
        },
        {
          name: 'Locations',
          shortName: 'Locations',
          description: 'Find nearest Mr. Cow location',
          url: '/locations',
          icons: [{ src: '/assets/icons/location-icon-96x96.png', sizes: '96x96' }]
        },
        {
          name: 'Menu',
          shortName: 'Menu',
          description: 'Browse our Korean street food menu',
          url: '/menu',
          icons: [{ src: '/assets/icons/menu-icon-96x96.png', sizes: '96x96' }]
        }
      ],

      // Protocol handlers for food ordering
      protocolHandlers: [
        {
          protocol: 'web+mrcow',
          url: '/order?item=%s'
        }
      ]
    };
  }

  // Service Worker configuration for offline functionality
  static getServiceWorkerConfig() {
    return {
      // Cache strategies for different content types
      cacheStrategies: {
        // Static assets - cache first
        static: {
          strategy: 'CacheFirst',
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          maxEntries: 100
        },
        
        // Menu data - network first with cache fallback
        menuData: {
          strategy: 'NetworkFirst',
          maxAgeSeconds: 60 * 60 * 2, // 2 hours
          maxEntries: 50
        },
        
        // Location data - stale while revalidate
        locationData: {
          strategy: 'StaleWhileRevalidate',
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
          maxEntries: 25
        },
        
        // Images - cache first
        images: {
          strategy: 'CacheFirst',
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          maxEntries: 200
        }
      },

      // Files to precache for offline functionality
      precacheFiles: [
        '/',
        '/index.html',
        '/manifest.json',
        '/assets/css/main.css',
        '/assets/js/app.js',
        '/assets/icons/icon-192x192.png',
        '/assets/icons/icon-512x512.png'
      ],

      // Background sync for orders
      backgroundSync: {
        enabled: true,
        tags: ['order-sync', 'feedback-sync']
      }
    };
  }

  // Notification configuration
  static getNotificationConfig() {
    return {
      // Default notification settings
      defaultSettings: {
        icon: '/assets/icons/notification-icon-192x192.png',
        badge: '/assets/icons/badge-icon-96x96.png',
        tag: 'mrcow-notification',
        requireInteraction: false,
        silent: false
      },

      // Notification types for food ordering
      types: {
        orderConfirmed: {
          title: 'Order Confirmed!',
          body: 'Your Mr. Cow order has been confirmed and is being prepared.',
          icon: '/assets/icons/order-confirmed-icon.png',
          tag: 'order-confirmed',
          actions: [
            {
              action: 'view-order',
              title: 'View Order',
              icon: '/assets/icons/view-icon.png'
            }
          ]
        },
        
        orderReady: {
          title: 'Order Ready for Pickup!',
          body: 'Your delicious Korean street food is ready at Mr. Cow.',
          icon: '/assets/icons/order-ready-icon.png',
          tag: 'order-ready',
          requireInteraction: true,
          actions: [
            {
              action: 'directions',
              title: 'Get Directions',
              icon: '/assets/icons/directions-icon.png'
            },
            {
              action: 'call-store',
              title: 'Call Store',
              icon: '/assets/icons/phone-icon.png'
            }
          ]
        },

        specialOffer: {
          title: 'Special Offer at Mr. Cow!',
          body: 'Check out our latest Korean corndog specials and limited-time offers.',
          icon: '/assets/icons/special-offer-icon.png',
          tag: 'special-offer',
          actions: [
            {
              action: 'view-offers',
              title: 'View Offers',
              icon: '/assets/icons/offers-icon.png'
            }
          ]
        }
      }
    };
  }

  // App-specific feature flags and settings
  static getFeatureConfig() {
    return {
      // Geolocation settings
      geolocation: {
        enabled: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        enableHighAccuracy: true
      },

      // Order settings
      ordering: {
        maxItemsPerOrder: 50,
        maxQuantityPerItem: 10,
        orderTimeoutMinutes: 30,
        allowSpecialInstructions: true,
        maxSpecialInstructionLength: 200
      },

      // Cart settings
      cart: {
        persistAcrossSessions: true,
        autoSaveInterval: 5000, // 5 seconds
        clearAfterHours: 24
      },

      // UI settings
      ui: {
        showKoreanNames: true,
        showNutritionInfo: true,
        showAllergenWarnings: true,
        enableAnimations: true,
        compactMode: false
      },

      // Performance settings
      performance: {
        lazyLoadImages: true,
        preloadMenuImages: true,
        enableVirtualScrolling: true,
        maxConcurrentRequests: 6
      }
    };
  }

  // Analytics and tracking configuration
  static getAnalyticsConfig() {
    return {
      // Events to track for food ordering app
      events: {
        appOpen: 'app_open',
        locationSelected: 'location_selected',
        menuViewed: 'menu_viewed',
        itemAddedToCart: 'item_added_to_cart',
        cartViewed: 'cart_viewed',
        orderStarted: 'order_started',
        orderCompleted: 'order_completed',
        orderCancelled: 'order_cancelled',
        searchPerformed: 'search_performed',
        filterApplied: 'filter_applied'
      },

      // User properties to track
      userProperties: {
        preferredLocation: 'preferred_location',
        totalOrders: 'total_orders',
        avgOrderValue: 'avg_order_value',
        favoriteCategory: 'favorite_category',
        lastOrderDate: 'last_order_date'
      }
    };
  }

  // Error handling and logging configuration
  static getErrorConfig() {
    return {
      // Error types specific to food ordering
      errorTypes: {
        LOCATION_ACCESS_DENIED: 'Location access was denied by user',
        MENU_LOAD_FAILED: 'Failed to load menu data',
        ORDER_SUBMISSION_FAILED: 'Failed to submit order',
        PAYMENT_FAILED: 'Payment processing failed',
        STORE_CLOSED: 'Selected store is currently closed',
        ITEM_UNAVAILABLE: 'Selected item is currently unavailable',
        NETWORK_ERROR: 'Network connection error'
      },

      // Retry policies
      retryPolicies: {
        menuData: { maxRetries: 3, backoffMs: 1000 },
        orderSubmission: { maxRetries: 2, backoffMs: 2000 },
        payment: { maxRetries: 1, backoffMs: 0 }
      }
    };
  }
}
