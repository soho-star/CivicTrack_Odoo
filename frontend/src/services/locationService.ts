// Location service using OpenStreetMap Nominatim API for geocoding

interface GeocodingResult {
  lat: number;
  lng: number;
  address: string;
  display_name: string;
}

interface ReverseGeocodingResult {
  address: string;
  display_name: string;
}

class LocationService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';
  
  // Forward geocoding: address to coordinates
  async geocode(address: string): Promise<GeocodingResult[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?format=json&q=${encodeURIComponent(address)}&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: this.formatAddress(item.address),
        display_name: item.display_name
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  // Reverse geocoding: coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodingResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding request failed');
      }
      
      const data = await response.json();
      
      return {
        address: this.formatAddress(data.address),
        display_name: data.display_name
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  // Search for places/addresses with suggestions
  async searchPlaces(query: string): Promise<GeocodingResult[]> {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&extratags=1`
      );
      
      if (!response.ok) {
        throw new Error('Place search request failed');
      }
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: this.formatAddress(item.address),
        display_name: item.display_name
      }));
    } catch (error) {
      console.error('Place search error:', error);
      return [];
    }
  }

  // Format address from Nominatim response
  private formatAddress(addressComponents: any): string {
    if (!addressComponents) return '';

    const parts = [];
    
    // Add house number and road
    if (addressComponents.house_number && addressComponents.road) {
      parts.push(`${addressComponents.house_number} ${addressComponents.road}`);
    } else if (addressComponents.road) {
      parts.push(addressComponents.road);
    }
    
    // Add neighborhood or suburb
    if (addressComponents.neighbourhood) {
      parts.push(addressComponents.neighbourhood);
    } else if (addressComponents.suburb) {
      parts.push(addressComponents.suburb);
    }
    
    // Add city
    if (addressComponents.city) {
      parts.push(addressComponents.city);
    } else if (addressComponents.town) {
      parts.push(addressComponents.town);
    } else if (addressComponents.village) {
      parts.push(addressComponents.village);
    }
    
    // Add state/region
    if (addressComponents.state) {
      parts.push(addressComponents.state);
    }
    
    // Add country
    if (addressComponents.country) {
      parts.push(addressComponents.country);
    }
    
    return parts.join(', ');
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get user's current location with error handling
  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}

export const locationService = new LocationService();