import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../utils/constants';
import { issuesApi } from '../services/api';
import { Issue } from '../types';
import Header from '../components/layout/Header';
import IssueCard from '../components/features/issues/IssueCard';
import MapContainer from '../components/maps/MapContainer';
import { useGeolocation } from '../hooks/useGeolocation';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const { location } = useGeolocation();

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const userLocation = location || { lat: 40.7128, lng: -74.0060 };
        const result = await issuesApi.getIssuesWithinRadius({
          location: userLocation,
          radius_km: 5
        });
        setIssues(result.data.slice(0, 6)); // Show first 6 issues
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Report. Track. Resolve.
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
              Empower your community by reporting local issues and tracking their resolution. 
              Together, we can make our neighborhoods better.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="#features"
                className="border border-primary-300 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Issues Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Recent Community Issues
            </h2>
            <p className="text-lg text-gray-600">
              See what's happening in your neighborhood
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Issue Map</h3>
              <MapContainer
                center={location ? [location.lat, location.lng] : [40.7128, -74.0060]}
                issues={issues}
                height="300px"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest Reports</h3>
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading issues...</p>
                  </div>
                ) : issues.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No issues reported yet in this area.</p>
                ) : (
                  issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Join the Community
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How CivicTrack Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, effective civic engagement in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Issues</h3>
              <p className="text-gray-600">
                Easily report local problems with photos, location, and detailed descriptions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor the status of reported issues and receive updates from local authorities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">See Results</h3>
              <p className="text-gray-600">
                Watch as your community improves through collective action and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens already using CivicTrack to improve their communities.
          </p>
          <Link
            to="/register"
            className="btn-primary text-lg px-8 py-3"
          >
            Start Reporting Issues Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{APP_CONFIG.NAME}</h3>
            <p className="text-gray-400 mb-4">
              Empowering communities through transparent civic engagement.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 CivicTrack. Built with ❤️ for stronger communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;