import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, PanelBody, Button } from '../components/ui';
import { Home, ArrowLeft, Search } from 'lucide-react';

interface Error404Props {
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showSearchSuggestion?: boolean;
}

const Error404: React.FC<Error404Props> = ({
  message = "The page you're looking for doesn't exist.",
  showBackButton = true,
  showHomeButton = true,
  showSearchSuggestion = true
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSearch = () => {
    // Navigate to a search page or open search modal
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Panel variant="default" className="text-center">
          <PanelBody padding="lg">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-red-600">404</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Page Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {showHomeButton && (
                <Button
                  onClick={handleGoHome}
                  className="w-full"
                  variant="primary"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              )}
              
              {showBackButton && (
                <Button
                  onClick={handleGoBack}
                  className="w-full"
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
              
              {showSearchSuggestion && (
                <Button
                  onClick={handleSearch}
                  className="w-full"
                  variant="ghost"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please contact support or try refreshing the page.
              </p>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
};

export default Error404;