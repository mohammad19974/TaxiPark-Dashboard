import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

interface ResetSuccessProps {}

const ResetSuccess: React.FC<ResetSuccessProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
  }, [email, navigate]);

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-sm text-gray-600">
              Your password has been successfully reset for{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password Updated
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    You can now use your new password to sign in to your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Security Tips
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep your password secure and don't share it with anyone</li>
              <li>• Use a unique password for this account</li>
              <li>• Consider enabling two-factor authentication</li>
              <li>• Sign out from shared or public devices</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Sign In Button */}
            <Link
              to="/login"
              className="
                w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 transition-colors
              "
            >
              Sign In Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            {/* Back to Home */}
            <Link
              to="/"
              className="
                w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm 
                text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 transition-colors
              "
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              If you didn't request this password reset, please contact our support team immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetSuccess;