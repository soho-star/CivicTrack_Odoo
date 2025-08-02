import React, { useState, useEffect } from 'react';
import { CivicMap } from './MapContainer';
import { locationService } from '../../services/locationService';
import { useGeolocation } from '../../hooks/useGeolocation';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  className = ''
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [address, setAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  
  const { latitude, longitude, error: geoError } = useGeolocation();
  
  // Default center (you can change this to your city's coordinates)
  const defaultCenter: [number, number] = [23.0225, 72.5714]; // Ahmedabad, Gujarat
  
  const mapCenter: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng]
    : (latitude && longitude) 
    ? [latitude, longitude]
    : defaultCenter;

  // Handle map click
  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsLoadingAddress(true);
    
    try {
      const result = await locationService.reverseGeocode(lat, lng);
      setAddress(result.address);
      onLocationSelect({ lat, lng, address: result.address });
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await locationService.searchPlaces(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: any) => {
    setSelectedLocation({ lat: result.lat, lng: result.lng });
    setAddress(result.address);
    setSearchQuery(result.address);
    setSearchResults([]);
    onLocationSelect({ lat: result.lat, lng: result.lng, address: result.address });
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setSelectedLocation(location);
      setIsLoadingAddress(true);
      
      const result = await locationService.reverseGeocode(location.lat, location.lng);
      setAddress(result.address);
      setSearchQuery(result.address);
      onLocationSelect({ ...location, address: result.address });
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to get your current location. Please select a location on the map.');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a location..."
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 pr-12"
          />
          <button
            onClick={handleGetCurrentLocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            title="Use current location"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSearchResultSelect(result)}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
              >
                <div className="font-medium">{result.address}</div>
                <div className="text-sm text-gray-400 truncate">{result.display_name}</div>
              </button>
            ))}
          </div>
        )}
        
        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
        <div className="mb-3">
          <h3 className="text-white text-lg font-semibold mb-1">Select Location</h3>
          <p className="text-gray-400 text-sm">Click on the map to select the exact location of the issue</p>
        </div>
        
        <CivicMap
          center={mapCenter}
          zoom={15}
          onMapClick={handleMapClick}
          selectedLocation={selectedLocation}
          height="300px"
          className="rounded-xl overflow-hidden"
        />
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <h3 className="text-white text-lg font-semibold mb-3">Selected Location</h3>
          
          {isLoadingAddress ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-gray-400">Getting address...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Address:</span>
                <p className="text-white font-medium">{address || 'Address not found'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Coordinates:</span>
                <p className="text-white text-sm">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-blue-400 font-medium mb-1">How to select location:</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Search for an address in the search box above</li>
              <li>• Click the location icon to use your current location</li>
              <li>• Click directly on the map to select a precise location</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};