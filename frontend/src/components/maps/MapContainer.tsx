import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Issue } from '../../types';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapContainerProps {
  center: [number, number];
  zoom?: number;
  issues?: Issue[];
  onLocationSelect?: (lat: number, lng: number) => void;
  className?: string;
  height?: string;
}

const MapContainer = ({ 
  center, 
  zoom = 13, 
  issues = [], 
  onLocationSelect,
  className = '',
  height = '400px'
}: MapContainerProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Add click handler for location selection
    if (onLocationSelect) {
      mapRef.current.on('click', (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add issue markers
    issues.forEach((issue) => {
      if (!mapRef.current) return;
      
      let iconColor = '#3b82f6'; // blue
      if (issue.category === 'severe') iconColor = '#ef4444'; // red
      else if (issue.category === 'mild') iconColor = '#f59e0b'; // yellow

      const marker = L.marker([issue.location.lat, issue.location.lng])
        .addTo(mapRef.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${issue.title}</h3>
            <p class="text-sm text-gray-600">${issue.description.substring(0, 100)}...</p>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 text-xs rounded-full bg-${iconColor.replace('#', '')}-100 text-${iconColor.replace('#', '')}-800">
                ${issue.category}
              </span>
            </div>
          </div>
        `);
    });
  }, [issues]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div 
      ref={mapContainerRef} 
      className={`rounded-lg ${className}`}
      style={{ height }}
    />
  );
};

export default MapContainer;