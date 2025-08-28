import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../ui/modal/Modal';
import { useUpdateUser } from '../../api/hooks';
import { useToast } from '../ui/ToastContainer';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'manager' | 'operator';
  status: 'active' | 'inactive' | 'suspended';
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user: User | null;
}

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'manager' | 'operator';
  status: 'active' | 'inactive' | 'suspended';
  password?: string;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'operator',
    status: 'active',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [changePassword, setChangePassword] = useState(false);
  const updateUserMutation = useUpdateUser();
  const { showError } = useToast();

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        status: user.status,
        password: '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (changePassword && formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    try {
      const updateData: Partial<UserFormData> = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      };

      // Only include password if user wants to change it
      if (changePassword && formData.password) {
        updateData.password = formData.password;
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        ...updateData,
      });
      
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to update user:', error);
      
      // Extract error message from backend response
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user';
      
      // Handle specific validation errors
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('already')) {
        setErrors({ email: 'A user with this email already exists' });
      } else {
        // Show general error toast with full backend message
        showError('Failed to update user', errorMessage);
      }
    }
  };

  const handleClose = () => {
    setErrors({});
    setChangePassword(false);
    onClose();
  };

  if (!user) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={handleClose} size="md">
      <ModalHeader title="Edit User" onClose={handleClose} />
      
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`input w-full ${
                    errors.firstName ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`input w-full ${
                    errors.lastName ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input w-full ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input w-full ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password Section */}
            <div className="border-t pt-4">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="changePassword"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                  Change Password
                </label>
              </div>
              
              {changePassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`input w-full ${
                      errors.password ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="Enter new password (min. 6 characters)"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              )}
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as UserFormData['role'])}
                  className="input w-full"
                >
                  <option value="operator">Operator</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as UserFormData['status'])}
                  className="input w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline"
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={updateUserMutation.isPending}
          >
            {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};