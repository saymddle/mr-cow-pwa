// src/script/utils/location-helper.ts
import { Location } from '../types';
import { FRANCHISE_LOCATIONS } from '../data/locations';

export class LocationHelper {
  // Get all active locations
  static getAllLocations(): Location[] {
    return FRANCHISE_LOCATIONS.filter(location => location.isActive);
  }

  // Get location by ID
  static getLocationById(id: string): Location | null {
    return FRANCHISE_LOCATIONS.find(location => location.id === id) || null;
  }

  // Calculate distance between two coordinates using Haversine formula
  static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * 
      Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  }

  // Find nearest locations to user coordinates
  static findNearestLocations(
    userLat: number, 
    userLon: number, 
    limit: number = 5
  ): Array<Location & { distance: number }> {
    const locationsWithDistance = this.getAllLocations().map(location => ({
      ...location,
      distance: this.calculateDistance(
        userLat, 
        userLon, 
        location.coordinates.latitude, 
        location.coordinates.longitude
      )
    }));

    return locationsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  // Get user's current location
  static async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Check if location is currently open
  static isLocationOpen(location: Location, date: Date = new Date()): boolean {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[date.getDay()];
    const todayHours = location.hours[currentDay];

    if (!todayHours || todayHours.closed) {
      return false;
    }

    const currentTime = date.getHours() * 60 + date.getMinutes();
    const openTime = this.parseTime(todayHours.open);
    const closeTime = this.parseTime(todayHours.close);

    return currentTime >= openTime && currentTime < closeTime;
  }

  // Get locations by state
  static getLocationsByState(state: string): Location[] {
    return this.getAllLocations().filter(location => 
      location.address.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Search locations by name or city
  static searchLocations(query: string): Location[] {
    const searchTerm = query.toLowerCase();
    return this.getAllLocations().filter(location =>
      location.name.toLowerCase().includes(searchTerm) ||
      location.address.city.toLowerCase().includes(searchTerm) ||
      location.address.state.toLowerCase().includes(searchTerm) ||
      location.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }

  // Get hours for display
  static formatHours(location: Location): { [key: string]: string } {
    const formattedHours: { [key: string]: string } = {};
    
    Object.entries(location.hours).forEach(([day, hours]) => {
      if (hours.closed) {
        formattedHours[day] = 'Closed';
      } else {
        formattedHours[day] = `${this.formatTime(hours.open)} - ${this.formatTime(hours.close)}`;
      }
    });

    return formattedHours;
  }

  // Private helper methods
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}
