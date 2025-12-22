import { Coordinates } from '@/types';
import { NOMINATIM_ENDPOINT, NOMINATIM_PARAMS } from '@/constants';

interface GeocodingProvider {
  url: string;
  parse: (data: any) => string | null;
}

export const geocodingService = {
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    // Try local API first
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);
      if (response.ok) {
        const data = await response.json();
        if (data?.address) {
          return data.address;
        }
      }
    } catch (error) {
      console.warn('Local reverse geocode failed:', error);
    }

    // Fallback to public providers
    const providers: GeocodingProvider[] = [
      {
        url: `${NOMINATIM_ENDPOINT}?${NOMINATIM_PARAMS}&lat=${lat}&lon=${lng}`,
        parse: (data) => data?.display_name || null,
      },
      {
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=sk`,
        parse: (data) => {
          if (!data) return null;
          const parts = [
            data.city || data.locality,
            data.principalSubdivision,
            data.countryName,
          ].filter(Boolean);
          return parts.length ? parts.join(', ') : null;
        },
      },
      {
        url: `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`,
        parse: (data) =>
          data?.display_name || buildAddressFromComponents(data?.address),
      },
    ];

    for (const provider of providers) {
      try {
        const response = await fetch(provider.url);
        if (!response.ok) continue;
        
        const data = await response.json();
        const address = provider.parse(data);
        if (address) return address;
      } catch (error) {
        console.warn('Geocoding provider failed:', provider.url, error);
      }
    }

    return null;
  },

  async searchLocation(query: string): Promise<Coordinates | null> {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error('Location search failed:', error);
    }
    
    return null;
  },
};

function buildAddressFromComponents(components: any): string | null {
  if (!components) return null;
  
  const order = ['road', 'suburb', 'city', 'town', 'state', 'country'];
  const parts = order
    .map((key) => components[key])
    .filter((part) => typeof part === 'string' && part.trim().length > 0);
  
  return parts.length ? parts.join(', ') : null;
}
