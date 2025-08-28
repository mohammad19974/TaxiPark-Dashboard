import React, { useState, useEffect } from 'react';
import { Settings, Clock, Mail, Phone, Twitter, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

interface MaintenanceProps {
  title?: string;
  message?: string;
  estimatedDuration?: string;
  startTime?: Date;
  endTime?: Date;
  showProgress?: boolean;
  showContactInfo?: boolean;
  showSocialLinks?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  twitterHandle?: string;
  className?: string;
}

export const Maintenance: React.FC<MaintenanceProps> = ({
  title = "Under Maintenance",
  message = "We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!",
  estimatedDuration = "2 hours",
  startTime,
  endTime,
  showProgress = true,
  showContactInfo = true,
  showSocialLinks = false,
  contactEmail = "support@taxiparks.com",
  contactPhone = "+1 (555) 123-4567",
  twitterHandle = "@taxiparks",
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsed = currentTime.getTime() - startTime.getTime();
      const calculatedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setProgress(calculatedProgress);
    }
  }, [currentTime, startTime, endTime]);

  const getTimeRemaining = () => {
    if (!endTime) return null;
    
    const remaining = endTime.getTime() - currentTime.getTime();
    if (remaining <= 0) return "Maintenance should be complete";
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center px-4 ${className}`}>
      <div className="max-w-2xl w-full text-center">
        {/* Maintenance Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-yellow-200 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-16 h-16 text-yellow-600 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>

        {/* Maintenance Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Progress Bar */}
          {showProgress && startTime && endTime && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {getTimeRemaining()}
              </div>
            </div>
          )}

          {/* Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
            {startTime && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Started</span>
                </div>
                <div className="text-gray-600">{formatTime(startTime)}</div>
              </div>
            )}
            {endTime && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Expected Completion</span>
                </div>
                <div className="text-gray-600">{formatTime(endTime)}</div>
              </div>
            )}
          </div>

          {!startTime && !endTime && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Estimated Duration: {estimatedDuration}</span>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="mb-8">
            <Button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700"
            >
              <RefreshCw className="w-4 h-4" />
              Check Status
            </Button>
          </div>

          {/* Contact Information */}
          {showContactInfo && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Need Immediate Assistance?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Email Support</div>
                    <div className="text-sm text-gray-600">{contactEmail}</div>
                  </div>
                </a>
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Phone Support</div>
                    <div className="text-sm text-gray-600">{contactPhone}</div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Social Links */}
          {showSocialLinks && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Follow us for updates:
              </h3>
              <a
                href={`https://twitter.com/${twitterHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Twitter className="w-4 h-4" />
                {twitterHandle}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500">
          <p>
            We apologize for any inconvenience and appreciate your patience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;