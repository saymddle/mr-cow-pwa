// src/script/data/locations.ts
import { Location } from '../types';

export const FRANCHISE_LOCATIONS: Location[] = [
  {
    id: 'aiea-pearlridge',
    name: 'Mr. Cow Corndog - Aiea',
    address: {
      street: '98-1005 Moanalua Rd #527',
      city: 'Aiea',
      state: 'HI',
      zipCode: '96701',
      country: 'USA'
    },
    coordinates: {
      latitude: 21.3891,
      longitude: -157.9298
    },
    contact: {
      phone: '(808) 487-0200'
    },
    hours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '10:00', close: '21:00' }
    },
    features: ['Pearlridge Center', 'Washington Prime', 'Mall Location', 'Hawaiian Favorites'],
    isActive: true
  }
];
