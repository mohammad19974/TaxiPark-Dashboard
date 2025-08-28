import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../components/ui/ToastContainer';

interface ResetPasswordProps {}

interface PasswordStrength {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const resetToken = location.state?.resetToken;
  const email = location.state?.email;

  useEffect(() => {
    if (!resetToken || !email) {
      navigate('/forgot-password');
      return;
    }
  }, [resetToken, email, navigate]);

  useEffect(() => {
    const { password } = formData;
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = isPasswordValid && doPasswordsMatch && formData.password && formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      showError('Invalid Form', 'Please check all requirements');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Password Reset', 'Your password has been reset successfully');
        // Navigate to success page
        navigate('/reset-success', { 
          state: { email } 
        });
      } else {
        showError('Reset Failed', data.message || 'Failed to reset password');
      }
    } catch (error) {
      showError('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <div className={`flex items-center space-x-2 text-sm ${
      met ? 'text-green-600' : 'text-gray-500'
    }`}>
      {met ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <span>{text}</span>
    </div>
  );

  if (!resetToken || !email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600">
              Create a new password for{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="
                    block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500
                  "
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <PasswordRequirement 
                  met={passwordStrength.hasMinLength} 
                  text="At least 8 characters" 
                />
                <PasswordRequirement 
                  met={passwordStrength.hasUppercase} 
                  text="One uppercase letter" 
                />
                <PasswordRequirement 
                  met={passwordStrength.hasLowercase} 
                  text="One lowercase letter" 
                />
                <PasswordRequirement 
                  met={passwordStrength.hasNumber} 
                  text="One number" 
                />
                <PasswordRequirement 
                  met={passwordStrength.hasSpecialChar} 
                  text="One special character" 
                />
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`
                    block w-full px-3 py-2 pr-10 border rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500
                    ${
                      formData.confirmPassword && !doPasswordsMatch
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }
                  `}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !doPasswordsMatch && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="
                  w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                  text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                "
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>

          {/* Back Button */}
          <div className="mt-6">
            <Link
              to="/verify-otp"
              state={{ email }}
              className="
                w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm 
                text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 transition-colors
              "
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;