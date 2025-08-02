import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import CivicMap from '../components/map/MapContainer';

export default function MapPage() {
  const { user, loading } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  // Sample markers for demonstration
  const sampleMarkers = [
    {
      id: '1',
      position: [40.7589, -73.9851] as [number, number],
      title: 'Pothole on 5th Avenue',
      description: 'Large pothole causing traffic issues'
    },
    {
      id: '2', 
      position: [40.7505, -73.9934] as [number, number],
      title: 'Broken Street Light',
      description: 'Street light not working since last week'
    },
    {
      id: '3',
      position: [40.7614, -73.9776] as [number, number],
      title: 'Graffiti Removal Needed',
      description: 'Vandalism on building wall'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Community Issues Map</h1>
          <p className="text-gray-600 mt-2">
            View reported issues in your area and click on the map to select a location.
          </p>
        </div>

        {selectedLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900">Selected Location</h3>
            <p className="text-blue-700 text-sm">
              Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
            </p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Report Issue Here
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Issues Near You</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Urgent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span>In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Resolved</span>
              </div>
            </div>
          </div>
          
          <CivicMap
            center={[40.7589, -73.9851]}
            zoom={14}
            height="500px"
            markers={sampleMarkers}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMarkers.map((marker) => (
            <div key={marker.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{marker.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}