// src/script/utils/cart-manager.ts
import { Cart, CartSummary } from '../types/cart.js';
import { MenuItem } from '../types/menu.js';

// Keep your existing CartItem interface for backward compatibility
export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  customizations?: any;
  image?: string;
  koreanName?: string;
}

export class CartManager {
  private static instance: CartManager;
  private cartItems: CartItem[] = [];
  
  // Enhanced cart data with tax and tip
  private cart: Cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    tip: 0,
    total: 0,
    locationId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Production configuration
  private readonly TAX_RATE = 0.0875; // 8.75% tax rate
  private readonly STORAGE_KEY = 'mrCowCart';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  // Enhanced addItem with MenuItem integration and customizations
  addItem(item: CartItem | MenuItem, quantity: number = 1, customizations: Record<string, string> = {}): void {
    // Handle both old CartItem format and new MenuItem format
    let cartItem: CartItem;
    
    if ('category' in item && 'price' in item && !('menuItemId' in item)) {
      // Existing CartItem format
      cartItem = { ...item as CartItem };
    } else {
      // New MenuItem format
      const menuItem = item as MenuItem;
      cartItem = {
        id: `${menuItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: menuItem.name,
        koreanName: menuItem.koreanName,
        price: this.calculateItemPrice(menuItem, customizations),
        category: menuItem.category,
        quantity,
        customizations,
        image: menuItem.imageUrl
      };
    }

    // Check for existing item with same customizations
    const customizationString = JSON.stringify(customizations);
    const existingItemIndex = this.cartItems.findIndex(
      existing => existing.name === cartItem.name && 
      JSON.stringify(existing.customizations) === customizationString
    );

    if (existingItemIndex > -1) {
      this.cartItems[existingItemIndex].quantity += cartItem.quantity;
    } else {
      this.cartItems.push(cartItem);
    }

    this.updateCalculations();
    this.saveToStorage();
    this.notifyCartUpdated();
  }

  removeItem(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCalculations();
    this.saveToStorage();
    this.notifyCartUpdated();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(itemId);
      } else {
        this.updateCalculations();
        this.saveToStorage();
        this.notifyCartUpdated();
      }
    }
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  clear(): void {
    this.cartItems = [];
    this.cart = {
      items: [],
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0,
      locationId: this.cart.locationId, // Preserve location
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.saveToStorage();
    this.notifyCartUpdated();
  }

  // NEW: Enhanced cart summary with tax and tip
  getCartSummary(): CartSummary {
    const subtotal = this.getTotal();
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + tax + this.cart.tip;

    return {
      itemCount: this.getItemCount(),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      tip: Number(this.cart.tip.toFixed(2)),
      total: Number(total.toFixed(2)),
      isEmpty: this.cartItems.length === 0
    };
  }

  // NEW: Set tip amount or percentage
  setTip(tipAmount: number, isPercentage: boolean = false): void {
    const subtotal = this.getTotal();
    if (isPercentage) {
      this.cart.tip = subtotal * (tipAmount / 100);
    } else {
      this.cart.tip = tipAmount;
    }
    this.cart.updatedAt = new Date();
    this.saveToStorage();
    this.notifyCartUpdated();
  }

  // NEW: Set location for location-specific features
  setLocation(locationId: string): void {
    this.cart.locationId = locationId;
    this.updateCalculations();
    this.saveToStorage();
    this.notifyCartUpdated();
  }

  // NEW: Check if cart is empty
  isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  // NEW: Calculate item price with customizations (drink sizes, etc.)
  private calculateItemPrice(menuItem: MenuItem, customizations: Record<string, string>): number {
    let price = menuItem.price;
    
    // Handle drink size pricing
    if (menuItem.category === 'drinks' && customizations.Size) {
      if (customizations.Size.includes('24oz')) {
        price = 6.00; // 24oz price
      } else {
        price = 5.00; // 16oz price
      }
    }

    return price;
  }

  // NEW: Update all calculations (subtotal, tax, total)
  private updateCalculations(): void {
    const subtotal = this.getTotal();
    const tax = subtotal * this.TAX_RATE;
    
    this.cart.subtotal = subtotal;
    this.cart.tax = tax;
    this.cart.total = subtotal + tax + this.cart.tip;
    this.cart.updatedAt = new Date();
  }

  // NEW: Save cart to localStorage
  private saveToStorage(): void {
    try {
      const cartData = {
        items: this.cartItems,
        cart: {
          ...this.cart,
          createdAt: this.cart.createdAt.toISOString(),
          updatedAt: this.cart.updatedAt.toISOString()
        }
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }

  // NEW: Load cart from localStorage
  private loadFromStorage(): void {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const cartData = JSON.parse(savedData);
        this.cartItems = cartData.items || [];
        
        if (cartData.cart) {
          this.cart = {
            ...cartData.cart,
            createdAt: new Date(cartData.cart.createdAt),
            updatedAt: new Date(cartData.cart.updatedAt)
          };
        }
        
        this.updateCalculations();
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      this.cartItems = [];
    }
  }

  // Enhanced notification with more cart data
  private notifyCartUpdated(): void {
    // Dispatch custom event for cart updates
    const summary = this.getCartSummary();
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: {
        items: this.getItems(),
        total: this.getTotal(),
        count: this.getItemCount(),
        summary: summary,
        cart: {
          subtotal: summary.subtotal,
          tax: summary.tax,
          tip: summary.tip,
          total: summary.total
        }
      }
    }));
  }
}

// Export utilities for easy access
export const cartManager = CartManager.getInstance();

export const addToCart = (item: CartItem | MenuItem, quantity: number = 1, customizations: Record<string, string> = {}) => {
  cartManager.addItem(item, quantity, customizations);
};

export const removeFromCart = (itemId: string) => {
  cartManager.removeItem(itemId);
};

export const updateCartItemQuantity = (itemId: string, quantity: number) => {
  cartManager.updateQuantity(itemId, quantity);
};

export const clearCart = () => {
  cartManager.clear();
};

export const setCartTip = (tipAmount: number, isPercentage: boolean = false) => {
  cartManager.setTip(tipAmount, isPercentage);
};

export const setCartLocation = (locationId: string) => {
  cartManager.setLocation(locationId);
};

export const getCartSummary = () => {
  cartManager.getCartSummary();
};