import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issuesApi } from '../services/api';
import { Issue } from '../types';
import Header from '../components/layout/Header';
import { Badge, Card, Button } from '../components/ui';

const IssueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;
      try {
        const data = await issuesApi.getIssueById(id);
        setIssue(data);
      } catch (error) {
        console.error('Error loading issue:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading issue...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h1>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
        </div>

        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex space-x-2">
              <Badge variant={issue.category}>{issue.category}</Badge>
              <Badge variant={issue.status}>{issue.status}</Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👍 {issue.upvotes}</span>
              <span>👎 {issue.downvotes}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{issue.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p className="text-gray-900">{issue.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Reported</h3>
              <p className="text-gray-900">{new Date(issue.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {issue.images && issue.images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Issue image ${index + 1}`}
                    className="rounded-lg object-cover h-32 w-full"
                  />
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments & Updates</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Comments feature coming soon!</p>
            <p className="text-sm mt-2">Users will be able to discuss issues and receive updates from authorities.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IssueDetailsPage;