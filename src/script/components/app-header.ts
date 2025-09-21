// src/script/components/app-header.ts
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { cartManager } from '../utils/cart-manager.js';
import { menuItems } from '../data/menu-items.js';
import { MenuItem } from '../types/menu.js';

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String })
  currentLocation = 'Select Location';

  @property({ type: Boolean, reflect: true })
  showSearch = true;

  @property({ type: Boolean, reflect: true })
  isMobileMenuOpen = false;

  @state()
  private cartItemCount = 0;

  @state()
  private searchQuery = '';

  @state()
  private searchResults: MenuItem[] = [];

  @state()
  private showSearchResults = false;

  @state()
  private isSearchFocused = false;

  static styles = css`
    :host {
      --primary-color: #FF6B35;
      --secondary-color: #D32F2F;
      --accent-color: #FFB74D;
      --background-color: #FFFFFF;
      --text-primary: #2C2C2C;
      --text-secondary: #666666;
      --border-color: #E0E0E0;
      --shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      --radius: 12px;
      --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
      background: white;
      box-shadow: var(--shadow);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      gap: 20px;
    }

    /* Logo Section */
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: var(--transition);
      flex-shrink: 0;
    }

    .logo-section:hover {
      transform: scale(1.02);
    }

    .logo {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 20px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-tagline {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Location Section */
    .location-section {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #F8F9FA;
      padding: 8px 12px;
      border-radius: 20px;
      cursor: pointer;
      transition: var(--transition);
      min-width: 0;
      flex-shrink: 1;
    }

    .location-section:hover {
      background: #F1F3F4;
      transform: translateY(-1px);
    }

    .location-icon {
      width: 16px;
      height: 16px;
      fill: var(--primary-color);
      flex-shrink: 0;
    }

    .location-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }

    .location-arrow {
      width: 12px;
      height: 12px;
      fill: var(--text-secondary);
      transition: var(--transition);
      flex-shrink: 0;
    }

    .location-section:hover .location-arrow {
      transform: translateX(2px);
    }

    /* Search Section */
    .search-section {
      position: relative;
      flex: 1;
      max-width: 400px;
      margin: 0 20px;
    }

    .search-container {
      position: relative;
      background: #F8F9FA;
      border-radius: 25px;
      transition: var(--transition);
      border: 2px solid transparent;
    }

    .search-container.focused {
      background: white;
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      padding: 0 16px;
    }

    .search-icon {
      width: 20px;
      height: 20px;
      fill: var(--text-secondary);
      margin-right: 12px;
      transition: var(--transition);
    }

    .search-container.focused .search-icon {
      fill: var(--primary-color);
    }

    .search-input {
      flex: 1;
      border: none;
      background: none;
      padding: 12px 0;
      font-size: 1rem;
      color: var(--text-primary);
      outline: none;
    }

    .search-input::placeholder {
      color: var(--text-secondary);
      font-weight: 400;
    }

    .clear-search {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-search:hover {
      background: rgba(0, 0, 0, 0.1);
      color: var(--text-primary);
    }

    /* Search Results */
    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: var(--radius);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      max-height: 320px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 8px;
      border: 1px solid var(--border-color);
    }

    .search-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: var(--transition);
      border-bottom: 1px solid #F5F5F5;
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .search-result-item:hover {
      background: #F8F9FA;
    }

    .result-image {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
      background: var(--border-color);
    }

    .result-details {
      flex: 1;
    }

    .result-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9rem;
      margin-bottom: 2px;
    }

    .result-korean {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .result-price {
      font-weight: 600;
      color: var(--primary-color);
      font-size: 0.9rem;
    }

    .no-results {
      padding: 20px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    /* Cart Section */
    .cart-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .cart-button {
      position: relative;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border: none;
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    .cart-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    .cart-icon {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--accent-color);
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .cart-badge.animate {
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    /* Mobile Menu */
    .mobile-menu-button {
      display: none;
      background: none;
      border: none;
      color: var(--text-primary);
      width: 40px;
      height: 40px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: var(--transition);
    }

    .mobile-menu-button:hover {
      background: #F5F5F5;
    }

    .hamburger {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        height: 60px;
        gap: 12px;
      }

      .logo {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }

      .brand-name {
        font-size: 1.2rem;
      }

      .brand-tagline {
        font-size: 0.7rem;
      }

      .location-section {
        display: none;
      }

      .search-section {
        margin: 0 8px;
        max-width: none;
      }

      .search-input {
        font-size: 0.9rem;
      }

      .cart-button {
        width: 44px;
        height: 44px;
      }

      .mobile-menu-button {
        display: flex;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        padding: 0 12px;
      }

      .brand-text {
        display: none;
      }

      .search-section {
        margin: 0 4px;
      }

      .search-input {
        padding: 10px 0;
      }
    }

    /* Search overlay for mobile */
    @media (max-width: 768px) {
      .search-results {
        position: fixed;
        top: 60px;
        left: 12px;
        right: 12px;
        max-height: 60vh;
      }
    }

    /* Mobile search fullscreen */
    :host([search-focused]) .search-section {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: white;
      padding: 12px;
      box-shadow: var(--shadow);
      margin: 0;
      max-width: none;
    }

    @media (min-width: 381px) {
      :host([search-focused]) .search-section {
        position: relative;
        top: auto;
        left: auto;
        right: auto;
        z-index: auto;
        background: transparent;
        padding: 0;
        box-shadow: none;
        margin: 0 20px;
        max-width: 400px;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.updateCartCount();
    window.addEventListener('cart-updated', this.handleCartUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('cart-updated', this.handleCartUpdate);
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    
    // Update search-focused attribute for CSS
    if (changedProperties.has('isSearchFocused')) {
      if (this.isSearchFocused) {
        this.setAttribute('search-focused', '');
      } else {
        this.removeAttribute('search-focused');
      }
    }
  }

  private handleCartUpdate = () => {
    const previousCount = this.cartItemCount;
    this.updateCartCount();
    
    // Trigger animation if count increased
    if (this.cartItemCount > previousCount) {
      this.requestUpdate();
    }
  };

  private updateCartCount() {
    this.cartItemCount = cartManager.getItemCount();
  }

  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value.trim();
    
    if (this.searchQuery.length === 0) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    // Search menu items by name, Korean name, or description
    this.searchResults = menuItems.filter(item => 
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (item.koreanName && item.koreanName.includes(this.searchQuery)) ||
      item.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    ).slice(0, 6); // Limit to 6 results

    this.showSearchResults = true;
  }

  private handleSearchFocus() {
    this.isSearchFocused = true;
    if (this.searchQuery.length > 0) {
      this.showSearchResults = true;
    }
  }

  private handleSearchBlur() {
    // Delay hiding results to allow clicks on search results
    setTimeout(() => {
      this.showSearchResults = false;
      this.isSearchFocused = false;
    }, 150);
  }

  private clearSearch() {
    this.searchQuery = '';
    this.showSearchResults = false;
    this.searchResults = [];
    const searchInput = this.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
  }

  private handleSearchResultClick(item: MenuItem) {
    this.showSearchResults = false;
    this.searchQuery = '';
    
    // Dispatch event to scroll to menu item or show item details
    this.dispatchEvent(new CustomEvent('search-result-selected', {
      detail: { item },
      bubbles: true,
      composed: true
    }));
  }

  private handleLogoClick() {
    this.dispatchEvent(new CustomEvent('logo-clicked', {
      bubbles: true,
      composed: true
    }));
  }

  private handleLocationClick() {
    this.dispatchEvent(new CustomEvent('location-selector-open', {
      bubbles: true,
      composed: true
    }));
  }

  private handleCartClick() {
    this.dispatchEvent(new CustomEvent('cart-open', {
      bubbles: true,
      composed: true
    }));
  }

  private handleMobileMenuClick() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.dispatchEvent(new CustomEvent('mobile-menu-toggle', {
      detail: { isOpen: this.isMobileMenuOpen },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="header-container">
        <div class="header-content">
          <!-- Logo Section -->
          <div class="logo-section" @click="${this.handleLogoClick}">
            <div class="logo">🐄</div>
            <div class="brand-text">
              <div class="brand-name">Mr. Cow</div>
              <div class="brand-tagline">Korean Street Food</div>
            </div>
          </div>

          <!-- Location Section -->
          <div class="location-section" @click="${this.handleLocationClick}">
            <svg class="location-icon" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span class="location-text">${this.currentLocation}</span>
            <svg class="location-arrow" viewBox="0 0 24 24">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L12.17 12l-3.58 3.59z"/>
            </svg>
          </div>

          <!-- Search Section -->
          ${this.showSearch ? html`
            <div class="search-section">
              <div class="search-container ${this.isSearchFocused ? 'focused' : ''}">
                <div class="search-input-wrapper">
                  <svg class="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <input 
                    class="search-input"
                    type="text"
                    placeholder="Search corndogs, drinks..."
                    .value="${this.searchQuery}"
                    @input="${this.handleSearchInput}"
                    @focus="${this.handleSearchFocus}"
                    @blur="${this.handleSearchBlur}"
                  />
                  ${this.searchQuery ? html`
                    <button class="clear-search" @click="${this.clearSearch}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  ` : ''}
                </div>

                ${this.showSearchResults ? html`
                  <div class="search-results">
                    ${this.searchResults.length > 0 ? this.searchResults.map(item => html`
                      <div class="search-result-item" @click="${() => this.handleSearchResultClick(item)}">
                        <img 
                          class="result-image" 
                          src="${item.imageUrl || '/assets/images/menu/placeholder.jpg'}" 
                          alt="${item.name}"
                          @error="${(e: Event) => {
                            const img = e.target as HTMLImageElement;
                            img.src = '/assets/images/menu/placeholder.jpg';
                          }}"
                        />
                        <div class="result-details">
                          <div class="result-name">${item.name}</div>
                          ${item.koreanName ? html`<div class="result-korean">${item.koreanName}</div>` : ''}
                        </div>
                        <div class="result-price">$${item.price.toFixed(2)}</div>
                      </div>
                    `) : html`
                      <div class="no-results">
                        No items found for "${this.searchQuery}"
                      </div>
                    `}
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Cart Section -->
          <div class="cart-section">
            <button class="cart-button" @click="${this.handleCartClick}">
              <svg class="cart-icon" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              ${this.cartItemCount > 0 ? html`
                <span class="cart-badge ${this.cartItemCount > 0 ? 'animate' : ''}">${this.cartItemCount}</span>
              ` : ''}
            </button>

            <!-- Mobile Menu Button -->
            <button class="mobile-menu-button" @click="${this.handleMobileMenuClick}">
              <svg class="hamburger" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}