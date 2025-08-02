import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { issuesApi } from '../services/api';
import { locationService } from '../services/locationService';
import Header from '../components/layout/Header';
import { Button, Input, Card } from '../components/ui';
import { ISSUE_CATEGORIES } from '../utils/constants';

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'mild' as const,
    address: '',
    location: { lat: 0, lng: 0 }
  });

  const handleLocationDetect = async () => {
    try {
      const location = await locationService.getCurrentPosition();
      setFormData(prev => ({ ...prev, location }));
      // In real app, would reverse geocode to get address
      setFormData(prev => ({ ...prev, address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` }));
    } catch (error) {
      const defaultLocation = locationService.getDefaultLocation();
      setFormData(prev => ({ ...prev, location: defaultLocation }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await issuesApi.createIssue({
        ...formData,
        user_id: user.id,
        location: `POINT(${formData.location.lng} ${formData.location.lat})`,
        images: []
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating issue:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Report New Issue</h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Issue Title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Describe the issue briefly"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              >
                {Object.entries(ISSUE_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.label} - {category.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                className="input-field"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex space-x-2">
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter address or use location detection"
                  className="flex-1"
                />
                <Button type="button" variant="secondary" onClick={handleLocationDetect}>
                  📍 Detect
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                📸 Image upload feature coming soon! For now, you can report issues with text descriptions.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" loading={loading} className="flex-1">
                Submit Issue Report
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssuePage;