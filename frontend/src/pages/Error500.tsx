import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, PanelBody, Button } from '../components/ui';
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react';

interface Error500Props {
  error?: Error;
  onRetry?: () => void;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  showContactSupport?: boolean;
  customMessage?: string;
}

const Error500: React.FC<Error500Props> = ({
  error,
  onRetry,
  showRetryButton = true,
  showHomeButton = true,
  showContactSupport = true,
  customMessage
}) => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } catch (err) {
        console.error('Retry failed:', err);
      } finally {
        setIsRetrying(false);
      }
    } else {
      // Default retry behavior - reload the page
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // Open email client or navigate to support page
    window.location.href = 'mailto:support@taxipark.com?subject=Error Report&body=An error occurred on the page.';
  };

  const getErrorMessage = () => {
    if (customMessage) return customMessage;
    if (error?.message) return `Error: ${error.message}`;
    return 'An unexpected error occurred on our servers. Please try again later.';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Panel variant="default" className="text-center">
          <PanelBody padding="lg">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Server Error
              </h1>
              <p className="text-gray-600 mb-6">
                {getErrorMessage()}
              </p>
            </div>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
                <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
                  {error.stack || error.message}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {showRetryButton && (
                <Button
                  onClick={handleRetry}
                  className="w-full"
                  variant="primary"
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
              )}
              
              {showHomeButton && (
                <Button
                  onClick={handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              )}
              
              {showContactSupport && (
                <Button
                  onClick={handleContactSupport}
                  className="w-full"
                  variant="ghost"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact our support team with the error details above.
              </p>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
};

export default Error500;