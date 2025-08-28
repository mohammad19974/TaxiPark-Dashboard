import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Button } from '../ui';

interface Error404Props {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showSearchSuggestions?: boolean;
  className?: string;
}

export const Error404: React.FC<Error404Props> = ({
  title = "Page Not Found",
  message = "Sorry, the page you are looking for doesn't exist or has been moved.",
  showBackButton = true,
  showHomeButton = true,
  showSearchSuggestions = true,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const commonPages = [
    { name: 'Dashboard', path: '/' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-blue-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {showBackButton && (
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            )}
            {showHomeButton && (
              <Button
                onClick={handleGoHome}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            )}
          </div>

          {/* Quick Navigation */}
          {showSearchSuggestions && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Try visiting these pages instead:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {commonPages.map((page) => (
                  <button
                    key={page.path}
                    onClick={() => navigate(page.path)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-200"
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <button
              onClick={() => window.location.href = 'mailto:support@taxiparks.com'}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error404;