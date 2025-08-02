import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { issuesApi } from '../services/api';
import { Issue } from '../types';
import Header from '../components/layout/Header';
import IssueCard from '../components/features/issues/IssueCard';
import { Button } from '../components/ui';

const DashboardPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  useEffect(() => {
    const loadIssues = async () => {
      try {
        // Mock location for now
        const mockLocation = { lat: 40.7128, lng: -74.0060 };
        const result = await issuesApi.getIssuesWithinRadius({
          location: mockLocation,
          radius_km: 5
        });
        setIssues(result.data);
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const myIssues = issues.filter(issue => issue.user_id === user?.id);
  const displayIssues = activeTab === 'my' ? myIssues : issues;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link to="/report">
            <Button>Report New Issue</Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                All Issues ({issues.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Issues ({myIssues.length})
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading issues...</p>
          </div>
        ) : displayIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {activeTab === 'my' ? 'You haven\'t reported any issues yet.' : 'No issues found in your area.'}
            </p>
            <Link to="/report">
              <Button>Report Your First Issue</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;