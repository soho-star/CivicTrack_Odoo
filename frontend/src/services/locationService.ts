import { GeolocationCoords } from '../types';
import { MAP_CONFIG } from '../utils/constants';

export const locationService = {
  getCurrentPosition(): Promise<GeolocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  },

  getDefaultLocation(): GeolocationCoords {
    return {
      lat: MAP_CONFIG.DEFAULT_LAT,
      lng: MAP_CONFIG.DEFAULT_LNG
    };
  }
};