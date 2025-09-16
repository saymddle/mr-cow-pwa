// src/script/components/location-selector.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Location } from '../types';
import { LocationHelper } from '../utils/location-helper';
import { StorageHelper } from '../utils/storage-helper';
import { APP_CONSTANTS } from '../data/constants';

@customElement('location-selector')
export class LocationSelector extends LitElement {
  @state() private locations: Location[] = [];
  @state() private nearbyLocations: Array<Location & { distance: number }> = [];
  @state() private selectedLocation: Location | null = null;
  @state() private searchQuery: string = '';
  @state() private loading: boolean = false;
  @state() private error: string = '';
  @state() private userLocation: { latitude: number; longitude: number } | null = null;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .location-selector {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 24px;
    }

    .header h2 {
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_DARK};
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .header p {
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_LIGHT};
      margin: 0;
      font-size: 16px;
    }

    .search-section {
      margin-bottom: 24px;
    }

    .search-bar {
      position: relative;
      margin-bottom: 16px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: ${APP_CONSTANTS.BRAND_COLORS.PRIMARY_ORANGE};
    }

    .location-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px;
      background: ${APP_CONSTANTS.BRAND_COLORS.PRIMARY_ORANGE};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .location-button:hover {
      background: #e55a2b;
    }

    .location-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .locations-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .location-card {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .location-card:hover {
      border-color: ${APP_CONSTANTS.BRAND_COLORS.PRIMARY_ORANGE};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
    }

    .location-card.selected {
      border-color: ${APP_CONSTANTS.BRAND_COLORS.PRIMARY_ORANGE};
      background: rgba(255, 107, 53, 0.05);
    }

    .location-name {
      font-size: 18px;
      font-weight: 600;
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_DARK};
      margin: 0 0 8px 0;
    }

    .location-address {
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_LIGHT};
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .location-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .distance {
      color: ${APP_CONSTANTS.BRAND_COLORS.PRIMARY_ORANGE};
      font-weight: 500;
    }

    .hours {
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_LIGHT};
      font-size: 14px;
    }

    .open-status {
      font-weight: 500;
    }

    .open-status.open {
      color: #4caf50;
    }

    .open-status.closed {
      color: #f44336;
    }

    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .feature-tag {
      background: ${APP_CONSTANTS.BRAND_COLORS.ACCENT_YELLOW};
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_DARK};
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .loading {
      text-align: center;
      padding: 24px;
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_LIGHT};
    }

    .error {
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      text-align: center;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: ${APP_CONSTANTS.BRAND_COLORS.TEXT_LIGHT};
    }

    @media (max-width: 768px) {
      .location-selector {
        padding: 16px;
      }
      
      .header h2 {
        font-size: 20px;
      }
      
      .location-info {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadLocations();
    this.loadSelectedLocation();
  }

  render() {
    return html`
      <div class="location-selector">
        <div class="header">
          <h2>Choose Your Location</h2>
          <p>Select a Mr. Cow location to start ordering authentic Korean street food</p>
        </div>

        <div class="search-section">
          <div class="search-bar">
            <input
              type="text"
              class="search-input"
              placeholder="Search by city, state, or location name..."
              .value=${this.searchQuery}
              @input=${this.handleSearchInput}
            />
          </div>
          
          <button
            class="location-button"
            @click=${this.findNearbyLocations}
            .disabled=${this.loading}
          >
            📍 Find Locations Near Me
          </button>
        </div>

        ${this.error ? html`<div class="error">${this.error}</div>` : ''}

        ${this.loading 
          ? html`<div class="loading">Finding locations...</div>`
          : this.renderLocationsList()
        }
      </div>
    `;
  }

  private renderLocationsList() {
    const locationsToShow = this.getFilteredLocations();

    if (locationsToShow.length === 0) {
      return html`
        <div class="empty-state">
          <h3>No locations found</h3>
          <p>Try adjusting your search or allow location access to find nearby stores.</p>
        </div>
      `;
    }

    return html`
      <div class="locations-list">
        ${locationsToShow.map(location => this.renderLocationCard(location))}
      </div>
    `;
  }

  private renderLocationCard(location: Location & { distance?: number }) {
    const isSelected = this.selectedLocation?.id === location.id;
    const isOpen = LocationHelper.isLocationOpen(location);
    const formattedHours = LocationHelper.formatHours(location);
    const today = new Date().toLocaleDateString('en', { weekday: 'long' }).toLowerCase();

    return html`
      <div 
        class="location-card ${isSelected ? 'selected' : ''}"
        @click=${() => this.selectLocation(location)}
      >
        <h3 class="location-name">${location.name}</h3>
        
        <div class="location-address">
          ${location.address.street}<br>
          ${location.address.city}, ${location.address.state} ${location.address.zipCode}
        </div>

        <div class="location-info">
          <div>
            ${location.distance ? html`
              <span class="distance">${location.distance.toFixed(1)} miles away</span> • 
            ` : ''}
            <span class="open-status ${isOpen ? 'open' : 'closed'}">
              ${isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          
          <div class="hours">
            Today: ${formattedHours[today]}
          </div>
        </div>

        <div class="features">
          ${location.features.map(feature => html`
            <span class="feature-tag">${feature}</span>
          `)}
        </div>
      </div>
    `;
  }

  private async loadLocations() {
    this.locations = LocationHelper.getAllLocations();
  }

  private loadSelectedLocation() {
    this.selectedLocation = StorageHelper.getSelectedLocation();
  }

  private handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  private async findNearbyLocations() {
    this.loading = true;
    this.error = '';

    try {
      this.userLocation = await LocationHelper.getCurrentLocation();
      this.nearbyLocations = LocationHelper.findNearestLocations(
        this.userLocation.latitude,
        this.userLocation.longitude,
        10
      );
    } catch (error) {
      this.error = 'Unable to access your location. Please search manually or enable location services.';
      console.error('Geolocation error:', error);
    } finally {
      this.loading = false;
    }
  }

  private selectLocation(location: Location) {
    this.selectedLocation = location;
    StorageHelper.saveSelectedLocation(location);
    
    // Dispatch event for other components
    this.dispatchEvent(new CustomEvent('location-selected', {
      detail: location,
      bubbles: true,
      composed: true
    }));
  }

  private getFilteredLocations() {
    let locationsToShow: Array<Location & { distance?: number }> = [];

    // If we have nearby locations, show those first
    if (this.nearbyLocations.length > 0) {
      locationsToShow = this.nearbyLocations;
    } else {
      locationsToShow = this.locations.map(location => ({ ...location }));
    }

    // Filter by search query if provided
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      locationsToShow = locationsToShow.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.address.city.toLowerCase().includes(query) ||
        location.address.state.toLowerCase().includes(query) ||
        location.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    return locationsToShow;
  }
}
