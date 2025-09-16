import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

// Type definitions for menu structure
interface MenuItem {
  id: string;
  name: string;
  nameKorean: string;
  price: number;
  description: string;
  descriptionKorean: string;
  category: 'corndogs' | 'drinks' | 'sides' | 'specials';
  image: string;
  allergens: string[];
  dietary: string[];
  spiceLevel?: number;
  isRecommended?: boolean;
  customizations?: {
    coatings?: string[];
    fillings?: string[];
    sizes?: { size: string; price: number }[];
    toppings?: string[];
  };
}

interface MenuCategory {
  id: string;
  name: string;
  nameKorean: string;
  icon: string;
  items: MenuItem[];
}

@customElement('menu-view')
export class MenuView extends LitElement {
  @property({ type: String }) selectedLocation = '';
  @property({ type: Number }) taxRate = 0.0875; // Default 8.75% tax rate
  
  @state() private searchQuery = '';
  @state() private selectedCategory = 'corndogs';
  @state() private filteredItems: MenuItem[] = [];
  @state() private categories: MenuCategory[] = [];

  static styles = css`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      font-family: 'Noto Sans', 'Noto Sans KR', sans-serif;
    }

    .menu-header {
      background: linear-gradient(135deg, #FF6B35, #D32F2F);
      color: white;
      padding: 2rem 1.5rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(255, 107, 53, 0.3);
    }

    .menu-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .menu-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 1.5rem;
    }

    .search-container {
      position: relative;
      max-width: 400px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      font-size: 1.2rem;
    }

    .category-nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .category-nav::-webkit-scrollbar {
      display: none;
    }

    .category-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      font-weight: 600;
      min-width: fit-content;
    }

    .category-btn:hover {
      border-color: #FF6B35;
      background: #fff5f0;
      transform: translateY(-2px);
    }

    .category-btn.active {
      background: linear-gradient(135deg, #FF6B35, #D32F2F);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
    }

    .category-icon {
      font-size: 1.2rem;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .category-section {
      margin-bottom: 3rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 3px solid #FF6B35;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2c2c2c;
      margin: 0;
    }

    .section-subtitle {
      font-size: 1rem;
      color: #666;
      font-style: italic;
    }

    .no-results {
      text-align: center;
      padding: 3rem 1rem;
      color: #666;
    }

    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .location-info {
      background: #f8f9fa;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      border-left: 4px solid #FF6B35;
    }

    .location-text {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
    }

    .tax-info {
      font-size: 0.8rem;
      color: #888;
      text-align: center;
      margin-top: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      :host {
        padding: 0.5rem;
      }

      .menu-header {
        padding: 1.5rem 1rem;
        margin-bottom: 1.5rem;
      }

      .menu-title {
        font-size: 2rem;
      }

      .menu-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .category-nav {
        gap: 0.25rem;
      }

      .category-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }

    /* Loading animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .menu-grid {
      animation: fadeInUp 0.6s ease-out;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initializeMenuData();
    this.updateFilteredItems();
  }

  private initializeMenuData() {
    // Mock menu data based on your provided menu
    this.categories = [
      {
        id: 'corndogs',
        name: 'Korean Corndogs',
        nameKorean: '핫도그',
        icon: '🌭',
        items: [
          {
            id: 'classic',
            name: 'Mr. Cow Classic',
            nameKorean: '미스터 카우 클래식',
            price: 5.5,
            description: 'Basic style corn dog (Recommended Sugar Coated)',
            descriptionKorean: '기본 스타일 콘도그 (설탕 코팅 추천)',
            category: 'corndogs',
            image: '/images/classic-corndog.jpg',
            allergens: ['gluten', 'eggs'],
            dietary: [],
            isRecommended: true,
            customizations: {
              coatings: ['Sugar', 'Plain'],
              fillings: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog']
            }
          },
          {
            id: 'fried-potato',
            name: 'Fried Potato',
            nameKorean: '감자 핫도그',
            price: 7.0,
            description: 'Wrapped with bite-size potato fries (Recommended Sugar Coated)',
            descriptionKorean: '한입 크기 감자튀김으로 감싼 핫도그',
            category: 'corndogs',
            image: '/images/potato-corndog.jpg',
            allergens: ['gluten', 'eggs'],
            dietary: [],
            customizations: {
              coatings: ['Sugar', 'Plain'],
              fillings: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog']
            }
          },
          {
            id: 'flaming-potato',
            name: 'Flaming Potato',
            nameKorean: '플레이밍 포테이토',
            price: 8.0,
            description: 'Potato fries + Cheetos with sauce options',
            descriptionKorean: '감자튀김 + 치토스, 소스 선택 가능',
            category: 'corndogs',
            image: '/images/flaming-potato.jpg',
            allergens: ['gluten', 'eggs', 'dairy'],
            dietary: [],
            spiceLevel: 2,
            customizations: {
              coatings: ['Hot Sauce 🌶️', 'Mild Sauce'],
              fillings: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog']
            }
          }
          // Additional corndog items would go here...
        ]
      },
      {
        id: 'drinks',
        name: 'Korean Beverages',
        nameKorean: '음료수',
        icon: '🥤',
        items: [
          {
            id: 'strawberry-mango-ade',
            name: 'Strawberry & Mango Ade',
            nameKorean: '딸기 망고 에이드',
            price: 5.0, // 16oz base price
            description: 'Refreshing fruit ade with real fruit pieces',
            descriptionKorean: '실제 과일 조각이 들어간 상큼한 과일 에이드',
            category: 'drinks',
            image: '/images/strawberry-mango-ade.jpg',
            allergens: [],
            dietary: ['vegan', 'gluten-free'],
            customizations: {
              sizes: [
                { size: '16oz', price: 5.0 },
                { size: '24oz', price: 6.0 }
              ],
              toppings: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly']
            }
          }
          // Additional drink items would go here...
        ]
      }
    ];
  }

  private updateFilteredItems() {
    const activeCategory = this.categories.find(cat => cat.id === this.selectedCategory);
    if (!activeCategory) {
      this.filteredItems = [];
      return;
    }

    let items = activeCategory.items;
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.nameKorean.includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    this.filteredItems = items;
  }

  private handleSearch(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.updateFilteredItems();
  }

  private selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.updateFilteredItems();
  }

  // @ts-ignore - Utility methods for future use
  private calculateTaxAmount(price: number): number {
    return Math.round(price * this.taxRate * 100) / 100;
  }

  // @ts-ignore - Utility methods for future use
  private formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  render() {
    const activeCategory = this.categories.find(cat => cat.id === this.selectedCategory);
    
    return html`
      <div class="menu-header">
        <h1 class="menu-title">🥢 Mr. Cow Menu</h1>
        <p class="menu-subtitle">Authentic Korean Street Food & Beverages</p>
        
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search menu items..."
            @input=${this.handleSearch}
            .value=${this.searchQuery}
          >
        </div>
      </div>

      ${this.selectedLocation ? html`
        <div class="location-info">
          <p class="location-text">📍 Ordering from: <strong>${this.selectedLocation}</strong></p>
        </div>
      ` : nothing}

      <nav class="category-nav">
        ${this.categories.map(category => html`
          <button
            class="category-btn ${classMap({ active: category.id === this.selectedCategory })}"
            @click=${() => this.selectCategory(category.id)}
          >
            <span class="category-icon">${category.icon}</span>
            <span>${category.name}</span>
          </button>
        `)}
      </nav>

      ${activeCategory ? html`
        <div class="category-section">
          <div class="section-header">
            <span class="category-icon">${activeCategory.icon}</span>
            <div>
              <h2 class="section-title">${activeCategory.name}</h2>
              <p class="section-subtitle">${activeCategory.nameKorean}</p>
            </div>
          </div>

          ${this.filteredItems.length > 0 ? html`
            <div class="menu-grid">
              ${this.filteredItems.map(item => html`
                <menu-item-card
                  .item=${item}
                  .taxRate=${this.taxRate}
                  @add-to-cart=${this.handleAddToCart}
                ></menu-item-card>
              `)}
            </div>
          ` : html`
            <div class="no-results">
              <div class="no-results-icon">🔍</div>
              <h3>No items found</h3>
              <p>Try adjusting your search or browse other categories</p>
            </div>
          `}
        </div>
      ` : nothing}

      <div class="tax-info">
        <p>Prices shown before tax. Tax rate: ${(this.taxRate * 100).toFixed(2)}% • All items prepared fresh to order</p>
      </div>
    `;
  }

  private handleAddToCart(e: CustomEvent) {
    // Forward the add-to-cart event to parent components
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: e.detail,
      bubbles: true,
      composed: true
    }));
  }
}