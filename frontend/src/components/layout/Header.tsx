import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { APP_CONFIG } from '../../utils/constants';
import Button from '../ui/Button';

const Header = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              {APP_CONFIG.NAME}
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/report" className="text-gray-600 hover:text-gray-900">
                  Report Issue
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Hi, {profile?.name || user.email}
                  </span>
                  <Button variant="secondary" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;