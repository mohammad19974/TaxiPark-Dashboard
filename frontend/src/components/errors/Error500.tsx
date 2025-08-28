import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle, Mail, Clock } from 'lucide-react';
import { Button } from '../ui';

interface Error500Props {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void | Promise<void>;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  showErrorDetails?: boolean;
  retryDelay?: number;
  maxRetries?: number;
  className?: string;
}

export const Error500: React.FC<Error500Props> = ({
  title = "Internal Server Error",
  message = "Something went wrong on our end. We're working to fix this issue.",
  error,
  onRetry,
  showRetryButton = true,
  showHomeButton = true,
  showErrorDetails = false,
  retryDelay = 3000,
  maxRetries = 3,
  className = ""
}) => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Default retry behavior - reload the page
        window.location.reload();
      }
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      
      // Start countdown for next retry
      if (retryCount < maxRetries - 1) {
        setCountdown(retryDelay / 1000);
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsRetrying(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setIsRetrying(false);
      }
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReportError = () => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: error?.toString() || 'Unknown error',
      retryCount
    };

    const subject = encodeURIComponent('Error Report - Internal Server Error');
    const body = encodeURIComponent(
      `Error Details:\n\n${JSON.stringify(errorDetails, null, 2)}`
    );
    
    window.location.href = `mailto:support@taxiparks.com?subject=${subject}&body=${body}`;
  };

  const getErrorMessage = () => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'Unknown error occurred';
  };

  const canRetry = retryCount < maxRetries && !isRetrying;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-red-200 select-none">
              500
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-red-400 animate-pulse" />
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

          {/* Retry Status */}
          {isRetrying && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {countdown > 0 ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Retrying in {countdown} seconds...
                  </span>
                ) : (
                  <span>Retrying... (Attempt {retryCount}/{maxRetries})</span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {showRetryButton && (
              <Button
                onClick={handleRetry}
                disabled={!canRetry}
                className={`flex items-center gap-2 px-6 py-3 ${
                  canRetry 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {retryCount >= maxRetries ? 'Max Retries Reached' : 'Try Again'}
              </Button>
            )}
            {showHomeButton && (
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            )}
          </div>

          {/* Error Details */}
          {(showErrorDetails || error) && (
            <div className="border-t pt-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-600 hover:text-gray-800 mb-4 underline"
              >
                {showDetails ? 'Hide' : 'Show'} Error Details
              </button>
              {showDetails && (
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                    <strong>Error:</strong> {getErrorMessage()}\n
                    <strong>Timestamp:</strong> {new Date().toISOString()}\n
                    <strong>URL:</strong> {window.location.href}\n
                    <strong>Retry Count:</strong> {retryCount}/{maxRetries}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            If this problem persists, please{' '}
            <button
              onClick={handleReportError}
              className="text-red-600 hover:text-red-800 underline inline-flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              report this error
            </button>
          </p>
          <p className="text-xs">
            Error ID: {Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error500;