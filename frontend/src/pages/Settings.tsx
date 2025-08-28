import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Clock,
  Mail,
  Phone,
  Save,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Users,
  Building,
  Globe,
} from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { AddUserModal } from '../components/modals/AddUserModal';
import { EditUserModal } from '../components/modals/EditUserModal';
import { useUsers, useDeleteUser } from '../api/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../components/ui/ToastContainer';

interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'manager' | 'operator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  avatar?: string;
}

interface ParkSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  currency: string;
  language: string;
  operatingHours: {
    start: string;
    end: string;
  };
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  bookingAlerts: boolean;
  driverAlerts: boolean;
  maintenanceAlerts: boolean;
  revenueReports: boolean;
}

interface PricingSettings {
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minimumFare: number;
  cancellationFee: number;
  waitingTimeRate: number;
  nightSurcharge: number;
  peakHourSurcharge: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    firstName: 'John',
    lastName: 'Admin',
    email: 'john@taxipark.com',
    phone: '+1234567890',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-23T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    firstName: 'Sarah',
    lastName: 'Manager',
    email: 'sarah@taxipark.com',
    phone: '+1234567891',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-01-23T09:15:00Z',
  },
  {
    id: '3',
    name: 'Mike Operator',
    firstName: 'Mike',
    lastName: 'Operator',
    email: 'mike@taxipark.com',
    phone: '+1234567892',
    role: 'operator',
    status: 'active',
    lastLogin: '2024-01-22T18:45:00Z',
  },
];

const roleColors = {
  admin: 'bg-danger-100 text-danger-800',
  manager: 'bg-primary-100 text-primary-800',
  operator: 'bg-success-100 text-success-800',
};

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-warning-100 text-warning-800',
};

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { data: users = [], isLoading: usersLoading, error: usersError } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [parkSettings, setParkSettings] = useState<ParkSettings>({
    name: '',
    address: '',
    phone: '',
    email: '',
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    operatingHours: {
      start: '06:00',
      end: '22:00',
    },
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    bookingAlerts: false,
    driverAlerts: false,
    maintenanceAlerts: false,
    revenueReports: false,
  });

  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    baseFare: 0,
    perKmRate: 0,
    perMinuteRate: 0,
    minimumFare: 0,
    cancellationFee: 0,
    waitingTimeRate: 0,
    nightSurcharge: 0,
    peakHourSurcharge: 0,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [parkData, notificationData, pricingData] = await Promise.all([
        settingsService.getParkSettings(),
        settingsService.getNotificationSettings(),
        settingsService.getPricingSettings()
      ]);
      
      setParkSettings(parkData);
      setNotificationSettings(notificationData);
      setPricingSettings(pricingData);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Prepare all settings updates with null checks
      const allUpdates = {
        // Park settings
        park_name: parkSettings.name || '',
        park_address: parkSettings.address || '',
        park_phone: parkSettings.phone || '',
        park_email: parkSettings.email || '',
        park_timezone: parkSettings.timezone || 'UTC',
        default_currency: parkSettings.currency || 'USD',
        park_language: parkSettings.language || 'en',
        park_operating_hours: JSON.stringify(parkSettings.operatingHours || { start: '06:00', end: '22:00' }),
        
        // Notification settings
        enable_notifications: notificationSettings.emailNotifications || notificationSettings.smsNotifications || notificationSettings.pushNotifications,
        notification_channels: JSON.stringify([
          ...(notificationSettings.emailNotifications ? ['email'] : []),
          ...(notificationSettings.smsNotifications ? ['sms'] : []),
          ...(notificationSettings.pushNotifications ? ['push'] : [])
        ]),
        
        // Pricing settings
        base_fare: pricingSettings.baseFare || 0,
        per_km_rate: pricingSettings.perKmRate || 0,
        waiting_time_rate: pricingSettings.waitingTimeRate || 0,
        minimum_fare: pricingSettings.minimumFare || 0,
        cancellation_fee: pricingSettings.cancellationFee || 0,
        per_minute_rate: pricingSettings.perMinuteRate || 0,
        night_surcharge: pricingSettings.nightSurcharge || 0,
        peak_hour_surcharge: pricingSettings.peakHourSurcharge || 0
      };
      
      // Update all settings in one batch
      await settingsService.updateMultipleSettings(allUpdates);
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // User management handlers
  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        showSuccess('User deleted', 'User has been successfully deleted.');
      } catch (error: any) {
        console.error('Error deleting user:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete user';
        showError('Delete failed', errorMessage);
      }
    }
  };

  const handleUserCreated = () => {
    setIsAddUserModalOpen(false);
    showSuccess('User created', 'New user has been successfully created.');
  };

  const handleUserUpdated = () => {
    setIsEditUserModalOpen(false);
    setSelectedUser(null);
    showSuccess('User updated', 'User information has been successfully updated.');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your taxi park configuration, users, and preferences
        </p>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Park Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Park Name</label>
                  <input
                    type="text"
                    value={parkSettings.name}
                    onChange={(e) => setParkSettings({ ...parkSettings, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    value={parkSettings.phone}
                    onChange={(e) => setParkSettings({ ...parkSettings, phone: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Address</label>
                  <input
                    type="text"
                    value={parkSettings.address}
                    onChange={(e) => setParkSettings({ ...parkSettings, address: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={parkSettings.email}
                    onChange={(e) => setParkSettings({ ...parkSettings, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Timezone</label>
                  <select
                    value={parkSettings.timezone}
                    onChange={(e) => setParkSettings({ ...parkSettings, timezone: e.target.value })}
                    className="input"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div>
                  <label className="label">Currency</label>
                  <select
                    value={parkSettings.currency}
                    onChange={(e) => setParkSettings({ ...parkSettings, currency: e.target.value })}
                    className="input"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Language</label>
                  <select
                    value={parkSettings.language}
                    onChange={(e) => setParkSettings({ ...parkSettings, language: e.target.value })}
                    className="input"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Start Time</label>
                  <input
                    type="time"
                    value={parkSettings.operatingHours.start}
                    onChange={(e) => setParkSettings({
                      ...parkSettings,
                      operatingHours: { ...parkSettings.operatingHours, start: e.target.value }
                    })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input
                    type="time"
                    value={parkSettings.operatingHours.end}
                    onChange={(e) => setParkSettings({
                      ...parkSettings,
                      operatingHours: { ...parkSettings.operatingHours, end: e.target.value }
                    })}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Alert Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.bookingAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        bookingAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">New booking alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.driverAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        driverAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Driver status alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.maintenanceAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        maintenanceAlerts: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vehicle maintenance alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.revenueReports}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        revenueReports: e.target.checked
                      })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Daily revenue reports</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Settings */}
        {activeTab === 'pricing' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Base Fare ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingSettings.baseFare}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    baseFare: parseFloat(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Per Kilometer Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingSettings.perKmRate}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    perKmRate: parseFloat(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Per Minute Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingSettings.perMinuteRate}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    perMinuteRate: parseFloat(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Minimum Fare ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingSettings.minimumFare}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    minimumFare: parseFloat(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Cancellation Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingSettings.cancellationFee}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    cancellationFee: parseFloat(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Waiting Time Rate ($/min)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingSettings.waitingTimeRate}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    waitingTimeRate: parseFloat(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Night Surcharge (%)</label>
                <input
                  type="number"
                  value={pricingSettings.nightSurcharge}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    nightSurcharge: parseInt(e.target.value)
                  })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Peak Hour Surcharge (%)</label>
                <input
                  type="number"
                  value={pricingSettings.peakHourSurcharge}
                  onChange={(e) => setPricingSettings({
                    ...pricingSettings,
                    peakHourSurcharge: parseInt(e.target.value)
                  })}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <button onClick={handleAddUser} className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
            
            <div className="card">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-head">User</th>
                      <th className="table-head">Role</th>
                      <th className="table-head">Status</th>
                      <th className="table-head">Last Login</th>
                      <th className="table-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            roleColors[user.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[user.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="text-sm text-gray-900">{formatLastLogin(user.lastLogin)}</span>
                        </td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require minimum 8 characters</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require uppercase and lowercase letters</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require at least one number</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require special characters</span>
                </label>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Maximum Login Attempts</label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable 2FA for all users</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable 2FA for admin users</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* User Management Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={handleUserCreated}
      />
      
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleUserUpdated}
        user={selectedUser}
      />
    </div>
  );
};