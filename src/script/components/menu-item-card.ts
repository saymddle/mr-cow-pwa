import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

// Import MenuItem interface from menu-view (in real app, this would be in shared types)
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

interface CartItem extends MenuItem {
  quantity: number;
  selectedCoating?: string;
  selectedFilling?: string;
  selectedSize?: string;
  selectedToppings?: string[];
  totalPrice: number;
}

@customElement('menu-item-card')
export class MenuItemCard extends LitElement {
  @property({ type: Object }) item!: MenuItem;
  @property({ type: Number }) taxRate = 0.0875;
  
  @state() private quantity = 1;
  @state() private selectedCoating = '';
  @state() private selectedFilling = '';
  @state() private selectedSize = '';
  @state() private selectedToppings: string[] = [];
  @state() private showNutritionModal = false;
  @state() private showCustomizationPanel = false;
  @state() private isAddingToCart = false;

  static styles = css`
    :host {
      display: block;
    }

    .item-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
      position: relative;
    }

    .item-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .item-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    }

    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .item-card:hover .item-image {
      transform: scale(1.05);
    }

    .image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 4rem;
      color: #FF6B35;
    }

    .badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge.recommended {
      background: #FFB74D;
      color: #E65100;
    }

    .badge.korean-authentic {
      background: #D32F2F;
      color: white;
    }

    .badge.spicy {
      background: #FF5722;
      color: white;
    }

    .spice-level {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 2px;
    }

    .spice-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ffcdd2;
    }

    .spice-dot.active {
      background: #FF5722;
    }

    .item-content {
      padding: 1.5rem;
    }

    .item-header {
      margin-bottom: 1rem;
    }

    .item-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2c2c2c;
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }

    .item-name-korean {
      font-size: 0.9rem;
      color: #666;
      font-style: italic;
      margin-bottom: 0.5rem;
    }

    .item-description {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .price-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .price-main {
      font-size: 1.5rem;
      font-weight: 700;
      color: #FF6B35;
    }

    .price-tax {
      font-size: 0.8rem;
      color: #888;
    }

    .allergen-info {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .allergen-tag {
      padding: 0.25rem 0.5rem;
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #856404;
    }

    .dietary-tag {
      padding: 0.25rem 0.5rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 12px;
      font-size: 0.75rem;
      color: #155724;
    }

    .customization-toggle {
      background: none;
      border: 1px solid #FF6B35;
      color: #FF6B35;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      width: 100%;
      transition: all 0.3s ease;
    }

    .customization-toggle:hover {
      background: #FF6B35;
      color: white;
    }

    .customization-panel {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1rem;
      border: 1px solid #e9ecef;
    }

    .customization-group {
      margin-bottom: 1rem;
    }

    .customization-group:last-child {
      margin-bottom: 0;
    }

    .customization-label {
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .customization-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .customization-option {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .customization-option:hover {
      border-color: #FF6B35;
    }

    .customization-option.selected {
      background: #FF6B35;
      color: white;
      border-color: #FF6B35;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .quantity-label {
      font-weight: 600;
      color: #2c2c2c;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      border-radius: 25px;
      padding: 0.25rem;
    }

    .quantity-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: #FF6B35;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .quantity-btn:hover {
      background: #D32F2F;
      transform: scale(1.1);
    }

    .quantity-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .quantity-display {
      min-width: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .add-to-cart-btn {
      width: 100%;
      background: linear-gradient(135deg, #FF6B35, #D32F2F);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .add-to-cart-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    .add-to-cart-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .add-to-cart-btn.adding {
      background: #4CAF50;
    }

    .nutrition-btn {
      width: 100%;
      background: none;
      border: 1px solid #ddd;
      color: #666;
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nutrition-btn:hover {
      border-color: #FF6B35;
      color: #FF6B35;
    }

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      max-width: 400px;
      width: 90%;
      animation: slideUp 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .adding-animation {
      animation: pulse 0.5s ease;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .item-content {
        padding: 1rem;
      }

      .item-name {
        font-size: 1.1rem;
      }

      .customization-options {
        gap: 0.25rem;
      }

      .customization-option {
        font-size: 0.75rem;
        padding: 0.4rem 0.6rem;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Set default selections for customizations
    if (this.item.customizations?.coatings?.[0]) {
      this.selectedCoating = this.item.customizations.coatings[0];
    }
    if (this.item.customizations?.fillings?.[0]) {
      this.selectedFilling = this.item.customizations.fillings[0];
    }
    if (this.item.customizations?.sizes?.[0]) {
      this.selectedSize = this.item.customizations.sizes[0].size;
    }
  }

  private calculateTotalPrice(): number {
    let basePrice = this.item.price;
    
    // Adjust price for size selection
    if (this.selectedSize && this.item.customizations?.sizes) {
      const sizeOption = this.item.customizations.sizes.find(s => s.size === this.selectedSize);
      if (sizeOption) {
        basePrice = sizeOption.price;
      }
    }
    
    return basePrice * this.quantity;
  }

  private updateQuantity(delta: number) {
    const newQuantity = this.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      this.quantity = newQuantity;
    }
  }

  private toggleCustomization() {
    this.showCustomizationPanel = !this.showCustomizationPanel;
  }

  private selectCustomization(type: string, value: string) {
    switch (type) {
      case 'coating':
        this.selectedCoating = value;
        break;
      case 'filling':
        this.selectedFilling = value;
        break;
      case 'size':
        this.selectedSize = value;
        break;
    }
  }

  // @ts-ignore - Utility method for future use
  private toggleTopping(topping: string) {
    if (this.selectedToppings.includes(topping)) {
      this.selectedToppings = this.selectedToppings.filter(t => t !== topping);
    } else {
      this.selectedToppings = [...this.selectedToppings, topping];
    }
  }

  private async handleAddToCart() {
    this.isAddingToCart = true;
    
    const cartItem: CartItem = {
      ...this.item,
      quantity: this.quantity,
      selectedCoating: this.selectedCoating,
      selectedFilling: this.selectedFilling,
      selectedSize: this.selectedSize,
      selectedToppings: [...this.selectedToppings],
      totalPrice: this.calculateTotalPrice()
    };

    // Simulate API delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 500));

    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: cartItem,
      bubbles: true,
      composed: true
    }));

    this.isAddingToCart = false;
  }

  private getImagePlaceholder(): string {
    const placeholders = {
      corndogs: '🌭',
      drinks: '🥤',
      sides: '🍟',
      specials: '⭐'
    };
    return placeholders[this.item.category] || '🍽️';
  }

  render() {
    const totalPrice = this.calculateTotalPrice();
    const taxAmount = totalPrice * this.taxRate;

    return html`
      <div class="item-card ${classMap({ 'adding-animation': this.isAddingToCart })}">
        <div class="item-image-container">
          <div class="image-placeholder">
            ${this.getImagePlaceholder()}
          </div>
          
          <div class="badges">
            ${this.item.isRecommended ? html`<span class="badge recommended">추천</span>` : nothing}
            <span class="badge korean-authentic">🇰🇷 Authentic</span>
            ${this.item.spiceLevel ? html`<span class="badge spicy">Spicy</span>` : nothing}
          </div>

          ${this.item.spiceLevel ? html`
            <div class="spice-level">
              ${Array.from({length: 3}, (_, i) => html`
                <div class="spice-dot ${classMap({ active: i < this.item.spiceLevel! })}"></div>
              `)}
            </div>
          ` : nothing}
        </div>

        <div class="item-content">
          <div class="item-header">
            <h3 class="item-name">${this.item.name}</h3>
            <p class="item-name-korean">${this.item.nameKorean}</p>
            <p class="item-description">${this.item.description}</p>
          </div>

          <div class="price-section">
            <div>
              <span class="price-main">$${totalPrice.toFixed(2)}</span>
              <div class="price-tax">+$${taxAmount.toFixed(2)} tax</div>
            </div>
          </div>

          ${this.item.allergens.length > 0 || this.item.dietary.length > 0 ? html`
            <div class="allergen-info">
              ${this.item.allergens.map(allergen => html`
                <span class="allergen-tag">⚠️ ${allergen}</span>
              `)}
              ${this.item.dietary.map(diet => html`
                <span class="dietary-tag">✅ ${diet}</span>
              `)}
            </div>
          ` : nothing}

          ${this.item.customizations ? html`
            <button class="customization-toggle" @click=${this.toggleCustomization}>
              ${this.showCustomizationPanel ? '▼' : '▶'} Customize Order
            </button>

            ${this.showCustomizationPanel ? html`
              <div class="customization-panel">
                ${this.item.customizations.coatings ? html`
                  <div class="customization-group">
                    <div class="customization-label">Coating:</div>
                    <div class="customization-options">
                      ${this.item.customizations.coatings.map(coating => html`
                        <button
                          class="customization-option ${classMap({ selected: this.selectedCoating === coating })}"
                          @click=${() => this.selectCustomization('coating', coating)}
                        >
                          ${coating}
                        </button>
                      `)}
                    </div>
                  </div>
                ` : nothing}

                ${this.item.customizations.fillings ? html`
                  <div class="customization-group">
                    <div class="customization-label">Filling:</div>
                    <div class="customization-options">
                      ${this.item.customizations.fillings.map(filling => html`
                        <button
                          class="customization-option ${classMap({ selected: this.selectedFilling === filling })}"
                          @click=${() => this.selectCustomization('filling', filling)}
                        >
                          ${filling}
                        </button>
                      `)}
                    </div>
                  </div>
                ` : nothing}

                ${this.item.customizations.sizes ? html`
                  <div class="customization-group">
                    <div class="customization-label">Size:</div>
                    <div class="customization-options">
                      ${this.item.customizations.sizes.map(sizeOption => html`
                        <button
                          class="customization-option ${classMap({ selected: this.selectedSize === sizeOption.size })}"
                          @click=${() => this.selectCustomization('size', sizeOption.size)}
                        >
                          ${sizeOption.size} - $${sizeOption.price.toFixed(2)}
                        </button>
                      `)}
                    </div>
                  </div>
                ` : nothing}
              </div>
            ` : nothing}
          ` : nothing}

          <div class="quantity-controls">
            <span class="quantity-label">Quantity:</span>
            <div class="quantity-selector">
              <button 
                class="quantity-btn" 
                @click=${() => this.updateQuantity(-1)}
                ?disabled=${this.quantity <= 1}
              >
                −
              </button>
              <span class="quantity-display">${this.quantity}</span>
              <button 
                class="quantity-btn" 
                @click=${() => this.updateQuantity(1)}
                ?disabled=${this.quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <button 
            class="add-to-cart-btn ${classMap({ adding: this.isAddingToCart })}"
            @click=${this.handleAddToCart}
            ?disabled=${this.isAddingToCart}
          >
            ${this.isAddingToCart ? html`
              <span>Adding...</span> ⏳
            ` : html`
              <span>Add to Cart</span> 🛒
            `}
          </button>

          <button class="nutrition-btn" @click=${() => this.showNutritionModal = true}>
            📊 Nutrition Information
          </button>
        </div>
      </div>

      ${this.showNutritionModal ? html`
        <div class="modal-overlay" @click=${() => this.showNutritionModal = false}>
          <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
            <h3>${this.item.name} - Nutrition Info</h3>
            <p>Detailed nutrition information will be displayed here.</p>
            <p><em>* Nutritional values are approximate and may vary based on customizations.</em></p>
            <button @click=${() => this.showNutritionModal = false}>Close</button>
          </div>
        </div>
      ` : nothing}
    `;
  }
}