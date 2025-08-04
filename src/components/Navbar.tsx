import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { 
  FileText, 
  Plus, 
  FolderOpen, 
  Mail, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home
} from 'lucide-react';
import { getuser } from '../api/auth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (!token) return;

    setLoadingProfile(true);
    getuser(token)
      .then(res => {
        setProfileUrl(res.data.profile || null);
      })
      .catch(() => {
        setProfileUrl(null);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const publicNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/signin', label: 'Sign In', icon: User },
    { path: '/signup', label: 'Sign Up', icon: User },
  ];

  const privateNavItems = [
    { path: '/spaces', label: 'My Spaces', icon: FolderOpen },
    { path: '/addSpace', label: 'Create Space', icon: Plus },
    { path: '/invites', label: 'Invitations', icon: Mail },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
            onClick={closeMobileMenu}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span>Spaces</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              // Public navigation
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActiveRoute('/') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  to="/signin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActiveRoute('/signin') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // Private navigation
              <>
                {privateNavItems.slice(0, -1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        isActiveRoute(item.path) 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
                
                {/* User Menu */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <Link 
                    to="/profile" 
                    className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                      isActiveRoute('/profile') ? 'bg-blue-100' : ''
                    }`}
                    title="Go to Profile"
                  >
                    {loadingProfile ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    ) : (
                      <img
                        src={profileUrl || '/default-profile.png'}
                        alt={user?.username || 'User'}
                        className={`w-8 h-8 rounded-full object-cover border-2 transition-all duration-200 ${
                          isActiveRoute('/profile') 
                            ? 'border-blue-400' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                    )}
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isActiveRoute('/profile') 
                        ? 'text-blue-700' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}>
                      {user?.username}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {!isAuthenticated ? (
              // Public mobile navigation
              <>
                {publicNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3 ${
                        isActiveRoute(item.path) 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            ) : (
              // Private mobile navigation
              <>
                {/* User Info - Now clickable */}
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 border-b border-gray-200 mb-2 rounded-lg transition-all duration-200 ${
                    isActiveRoute('/profile') 
                      ? 'bg-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {loadingProfile ? (
                      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                    ) : (
                      <img
                        src={profileUrl || '/default-profile.png'}
                        alt={user?.username || 'User'}
                        className={`w-10 h-10 rounded-full object-cover border-2 transition-all duration-200 ${
                          isActiveRoute('/profile') 
                            ? 'border-blue-400' 
                            : 'border-gray-300'
                        }`}
                      />
                    )}
                    <div>
                      <div className={`text-sm font-medium transition-colors duration-200 ${
                        isActiveRoute('/profile') 
                          ? 'text-blue-700' 
                          : 'text-gray-900'
                      }`}>
                        {user?.username || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        View Profile
                      </div>
                    </div>
                  </div>
                </Link>

                {privateNavItems.slice(0, -1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3 ${
                        isActiveRoute(item.path) 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3 mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;