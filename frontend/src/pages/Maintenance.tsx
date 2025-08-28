import React, { useState, useEffect } from 'react';
import { Panel, PanelBody, Button } from '../components/ui';
import { Settings, Clock, Mail, RefreshCw } from 'lucide-react';

interface MaintenanceProps {
  title?: string;
  message?: string;
  estimatedTime?: string;
  contactEmail?: string;
  showRefreshButton?: boolean;
  showContactButton?: boolean;
  maintenanceStartTime?: Date;
  estimatedEndTime?: Date;
}

const Maintenance: React.FC<MaintenanceProps> = ({
  title = "System Under Maintenance",
  message = "We're currently performing scheduled maintenance to improve your experience. Please check back soon.",
  estimatedTime = "2-3 hours",
  contactEmail = "support@taxipark.com",
  showRefreshButton = true,
  showContactButton = true,
  maintenanceStartTime,
  estimatedEndTime
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (estimatedEndTime) {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const diff = estimatedEndTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining('Maintenance should be completed');
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          setTimeRemaining(`Estimated ${hours}h ${minutes}m remaining`);
        } else {
          setTimeRemaining(`Estimated ${minutes}m remaining`);
        }
      };

      calculateTimeRemaining();
      const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute
      
      return () => clearInterval(timer);
    }
  }, [estimatedEndTime]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleContactSupport = () => {
    window.location.href = `mailto:${contactEmail}?subject=Maintenance Inquiry&body=I have a question about the current maintenance.`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <Panel variant="default" className="text-center shadow-lg">
          <PanelBody padding="lg">
            {/* Maintenance Illustration */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-12 h-12 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                {message}
              </p>
            </div>

            {/* Maintenance Details */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                {estimatedTime && (
                  <div className="flex items-center justify-center text-blue-800">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">Estimated Duration: {estimatedTime}</span>
                  </div>
                )}
                
                {timeRemaining && (
                  <div className="text-blue-700 font-medium">
                    {timeRemaining}
                  </div>
                )}
                
                {maintenanceStartTime && (
                  <div className="text-sm text-blue-600">
                    <strong>Started:</strong> {formatTime(maintenanceStartTime)}
                  </div>
                )}
                
                {estimatedEndTime && (
                  <div className="text-sm text-blue-600">
                    <strong>Expected completion:</strong> {formatTime(estimatedEndTime)}
                  </div>
                )}
              </div>
            </div>

            {/* Current Time */}
            <div className="mb-6 text-sm text-gray-500">
              Current time: {formatTime(currentTime)}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {showRefreshButton && (
                <Button
                  onClick={handleRefresh}
                  className="w-full"
                  variant="primary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Again
                </Button>
              )}
              
              {showContactButton && (
                <Button
                  onClick={handleContactSupport}
                  className="w-full"
                  variant="outline"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              )}
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">What's being updated?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Performance improvements</li>
                <li>• Security updates</li>
                <li>• New features and bug fixes</li>
                <li>• Database optimization</li>
              </ul>
              
              <p className="text-xs text-gray-500 mt-4">
                We apologize for any inconvenience. Your data is safe and will be available once maintenance is complete.
              </p>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
};

export default Maintenance;