// src/script/components/cart-modal.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { cartManager, CartItem, updateCartItemQuantity, removeFromCart, setCartTip, clearCart } from '../utils/cart-manager.js';
import { CartSummary } from '../types/cart.js';

@customElement('cart-modal')
export class CartModal extends LitElement {
  @property({ type: Boolean, reflect: true })
  isOpen = false;

  @state()
  private cartItems: CartItem[] = [];

  @state()
  private cartSummary: CartSummary = {
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    tip: 0,
    total: 0,
    isEmpty: true
  };

  @state()
  private selectedTipPercentage: number = 0;

  @state()
  private customTipAmount: number = 0;

  @state()
  private isProcessing = false;

  static styles = css`
    :host {
      --primary-color: #FF6B35;
      --secondary-color: #D32F2F;
      --accent-color: #FFB74D;
      --background-color: #FFFFFF;
      --text-primary: #2C2C2C;
      --text-secondary: #666666;
      --border-color: #E0E0E0;
      --success-color: #4CAF50;
      --error-color: #F44336;
      --shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      --radius: 12px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([is-open]) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: flex;
      align-items: flex-end;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
    }

    :host(:not([is-open])) {
      display: none;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    @keyframes slideDown {
      from { transform: translateY(0); }
      to { transform: translateY(100%); }
    }

    .modal-container {
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      background: var(--background-color);
      border-radius: var(--radius) var(--radius) 0 0;
      box-shadow: var(--shadow);
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border-radius: var(--radius) var(--radius) 0 0;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cart-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .close-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      font-size: 20px;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .modal-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: var(--text-secondary);
    }

    .empty-cart-icon {
      width: 80px;
      height: 80px;
      fill: var(--border-color);
      margin-bottom: 20px;
    }

    .empty-cart h3 {
      margin: 0 0 10px 0;
      color: var(--text-primary);
      font-size: 1.2rem;
    }

    .cart-items {
      padding: 20px;
    }

    .cart-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid var(--border-color);
      animation: fadeInUp 0.3s ease;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
      background: var(--border-color);
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 5px;
    }

    .item-korean-name {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .item-customizations {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 10px;
    }

    .item-price-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }

    .item-price {
      font-weight: 600;
      color: var(--primary-color);
      font-size: 1.1rem;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #F5F5F5;
      border-radius: 20px;
      padding: 4px;
    }

    .quantity-btn {
      background: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-color);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: var(--transition);
    }

    .quantity-btn:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-display {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
      color: var(--text-primary);
    }

    .remove-item-btn {
      background: none;
      border: none;
      color: var(--error-color);
      cursor: pointer;
      padding: 4px;
      margin-left: 10px;
      border-radius: 4px;
      transition: var(--transition);
    }

    .remove-item-btn:hover {
      background: rgba(244, 67, 54, 0.1);
    }

    .cart-summary {
      background: #F8F9FA;
      border-top: 1px solid var(--border-color);
      padding: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

    .summary-row.total {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--text-primary);
      padding-top: 8px;
      border-top: 1px solid var(--border-color);
      margin-top: 8px;
    }

    .tip-section {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: var(--radius);
      border: 1px solid var(--border-color);
    }

    .tip-title {
      font-weight: 600;
      margin-bottom: 15px;
      color: var(--text-primary);
    }

    .tip-options {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 15px;
    }

    .tip-option {
      background: white;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 10px 8px;
      text-align: center;
      cursor: pointer;
      transition: var(--transition);
      font-weight: 600;
    }

    .tip-option:hover {
      border-color: var(--primary-color);
    }

    .tip-option.selected {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .custom-tip {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .custom-tip input {
      flex: 1;
      padding: 10px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
    }

    .custom-tip input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .modal-actions {
      padding: 20px;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 12px;
    }

    .action-btn {
      flex: 1;
      padding: 16px;
      border: none;
      border-radius: var(--radius);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .clear-btn {
      background: #F5F5F5;
      color: var(--text-secondary);
      flex: 0.4;
    }

    .clear-btn:hover {
      background: #EEEEEE;
      color: var(--error-color);
    }

    .checkout-btn {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      position: relative;
      overflow: hidden;
    }

    .checkout-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    .checkout-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .modal-container {
        max-height: 95vh;
      }
      
      .tip-options {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      
      .modal-actions {
        flex-direction: column;
      }
      
      .clear-btn {
        flex: 1;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.updateCartData();
    window.addEventListener('cart-updated', this.handleCartUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('cart-updated', this.handleCartUpdate);
  }

  private handleCartUpdate = () => {
    this.updateCartData();
  };

  private updateCartData() {
    this.cartItems = cartManager.getItems();
    this.cartSummary = cartManager.getCartSummary();
  }

  private handleClose() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('cart-modal-close'));
  }

  private handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget) {
      this.handleClose();
    }
  }

  private handleQuantityChange(itemId: string, newQuantity: number) {
    updateCartItemQuantity(itemId, newQuantity);
  }

  private handleRemoveItem(itemId: string) {
    removeFromCart(itemId);
  }

  private handleTipSelection(percentage: number) {
    this.selectedTipPercentage = percentage;
    this.customTipAmount = 0;
    setCartTip(percentage, true);
  }

  private handleCustomTipChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const amount = parseFloat(input.value) || 0;
    this.customTipAmount = amount;
    this.selectedTipPercentage = 0;
    setCartTip(amount, false);
  }

  private handleClearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  }

  private async handleCheckout() {
    if (this.cartSummary.isEmpty || this.isProcessing) return;

    this.isProcessing = true;
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would integrate with payment processing
      alert('Checkout functionality would integrate with payment processor here!');
      
      // Clear cart after successful checkout
      clearCart();
      this.handleClose();
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  private formatCustomizations(customizations: any): string {
    if (!customizations || typeof customizations !== 'object') return '';
    
    return Object.entries(customizations)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ');
  }

  render() {
    return html`
      <div class="modal-container" @click="${this.handleBackdropClick}">
        <div class="modal-header">
          <h2 class="modal-title">
            <svg class="cart-icon" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Your Cart (${this.cartSummary.itemCount})
          </h2>
          <button class="close-button" @click="${this.handleClose}">
            ×
          </button>
        </div>

        <div class="modal-content">
          ${this.cartSummary.isEmpty ? this.renderEmptyCart() : this.renderCartItems()}
        </div>

        ${!this.cartSummary.isEmpty ? this.renderCartSummary() : ''}
      </div>
    `;
  }

  private renderEmptyCart() {
    return html`
      <div class="empty-cart">
        <svg class="empty-cart-icon" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <h3>Your cart is empty</h3>
        <p>Add some delicious Korean corndogs to get started!</p>
      </div>
    `;
  }

  private renderCartItems() {
    return html`
      <div class="cart-items">
        ${this.cartItems.map(item => html`
          <div class="cart-item">
            <img 
              class="item-image" 
              src="${item.image || '/assets/images/menu/placeholder.jpg'}" 
              alt="${item.name}"
              @error="${(e: Event) => {
                const img = e.target as HTMLImageElement;
                img.src = '/assets/images/menu/placeholder.jpg';
              }}"
            />
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              ${item.koreanName ? html`<div class="item-korean-name">${item.koreanName}</div>` : ''}
              ${item.customizations ? html`
                <div class="item-customizations">${this.formatCustomizations(item.customizations)}</div>
              ` : ''}
              <div class="item-price-controls">
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="quantity-controls">
                  <button 
                    class="quantity-btn" 
                    @click="${() => this.handleQuantityChange(item.id, item.quantity - 1)}"
                    ?disabled="${item.quantity <= 1}"
                  >
                    −
                  </button>
                  <span class="quantity-display">${item.quantity}</span>
                  <button 
                    class="quantity-btn" 
                    @click="${() => this.handleQuantityChange(item.id, item.quantity + 1)}"
                  >
                    +
                  </button>
                </div>
                <button 
                  class="remove-item-btn" 
                  @click="${() => this.handleRemoveItem(item.id)}"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  private renderCartSummary() {
    return html`
      <div class="cart-summary">
        <div class="tip-section">
          <div class="tip-title">Add Tip</div>
          <div class="tip-options">
            ${[15, 18, 20, 25].map(percentage => html`
              <button 
                class="tip-option ${this.selectedTipPercentage === percentage ? 'selected' : ''}"
                @click="${() => this.handleTipSelection(percentage)}"
              >
                ${percentage}%
              </button>
            `)}
          </div>
          <div class="custom-tip">
            <span>Custom: $</span>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              placeholder="0.00"
              .value="${this.customTipAmount > 0 ? this.customTipAmount.toFixed(2) : ''}"
              @input="${this.handleCustomTipChange}"
            />
          </div>
        </div>

        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${this.cartSummary.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Tax:</span>
          <span>$${this.cartSummary.tax.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Tip:</span>
          <span>$${this.cartSummary.tip.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>$${this.cartSummary.total.toFixed(2)}</span>
        </div>

        <div class="modal-actions">
          <button class="action-btn clear-btn" @click="${this.handleClearCart}">
            Clear Cart
          </button>
          <button 
            class="action-btn checkout-btn" 
            @click="${this.handleCheckout}"
            ?disabled="${this.cartSummary.isEmpty || this.isProcessing}"
          >
            ${this.isProcessing ? html`
              <div class="loading-spinner"></div>
              Processing...
            ` : html`
              Proceed to Checkout
            `}
          </button>
        </div>
      </div>
    `;
  }
}