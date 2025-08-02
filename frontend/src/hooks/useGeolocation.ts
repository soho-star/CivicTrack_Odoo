import { useState, useEffect } from 'react';
import { GeolocationCoords, GeolocationError } from '../types';

export const useGeolocation = (options?: PositionOptions) => {
  const [location, setLocation] = useState<GeolocationCoords | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError({ code: 0, message: 'Geolocation is not supported' });
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (error) => {
        setError({ code: error.code, message: error.message });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
        ...options
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, error, loading, getCurrentLocation };
};