import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  Car,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Eye,
  Edit,
  MoreVertical,
  UserCheck,
  UserX,
  DollarSign,
} from 'lucide-react';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'suspended' | 'on-break';
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  hoursWorked: number;
  completionRate: number;
  joinDate: string;
  lastActive: string;
  currentVehicle?: string;
  profileImage?: string;
  performance: {
    weeklyTrips: number;
    weeklyEarnings: number;
    averageRating: number;
    onTimeRate: number;
  };
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+966501234567',
    licenseNumber: 'DL123456789',
    status: 'active',
    rating: 4.8,
    totalTrips: 1250,
    totalEarnings: 45000,
    hoursWorked: 180,
    completionRate: 98,
    joinDate: '2023-01-15',
    lastActive: '2024-01-20T10:30:00Z',
    currentVehicle: 'ABC-123',
    performance: {
      weeklyTrips: 45,
      weeklyEarnings: 1800,
      averageRating: 4.8,
      onTimeRate: 95,
    },
  },
  {
    id: '2',
    firstName: 'Mohamed',
    lastName: 'Ali',
    email: 'mohamed.ali@email.com',
    phone: '+966501234568',
    licenseNumber: 'DL123456790',
    status: 'active',
    rating: 4.6,
    totalTrips: 980,
    totalEarnings: 38000,
    hoursWorked: 150,
    completionRate: 96,
    joinDate: '2023-03-20',
    lastActive: '2024-01-20T09:45:00Z',
    currentVehicle: 'XYZ-456',
    performance: {
      weeklyTrips: 38,
      weeklyEarnings: 1520,
      averageRating: 4.6,
      onTimeRate: 92,
    },
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+966501234569',
    licenseNumber: 'DL123456791',
    status: 'on-break',
    rating: 4.9,
    totalTrips: 1450,
    totalEarnings: 52000,
    hoursWorked: 200,
    completionRate: 99,
    joinDate: '2022-11-10',
    lastActive: '2024-01-20T08:15:00Z',
    currentVehicle: 'DEF-789',
    performance: {
      weeklyTrips: 42,
      weeklyEarnings: 1680,
      averageRating: 4.9,
      onTimeRate: 98,
    },
  },
  {
    id: '4',
    firstName: 'Omar',
    lastName: 'Abdullah',
    email: 'omar.abdullah@email.com',
    phone: '+966501234570',
    licenseNumber: 'DL123456792',
    status: 'inactive',
    rating: 4.3,
    totalTrips: 650,
    totalEarnings: 25000,
    hoursWorked: 90,
    completionRate: 94,
    joinDate: '2023-06-05',
    lastActive: '2024-01-19T16:20:00Z',
    performance: {
      weeklyTrips: 0,
      weeklyEarnings: 0,
      averageRating: 4.3,
      onTimeRate: 88,
    },
  },
];

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-danger-100 text-danger-800',
  'on-break': 'bg-warning-100 text-warning-800',
};

const statusIcons = {
  active: UserCheck,
  inactive: UserX,
  suspended: UserX,
  'on-break': Clock,
};

export const DriversEnhanced: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const filteredDrivers = drivers.filter((driver) => {
    const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    inactive: drivers.filter(d => d.status === 'inactive').length,
    onBreak: drivers.filter(d => d.status === 'on-break').length,
    suspended: drivers.filter(d => d.status === 'suspended').length,
    averageRating: drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length,
    totalEarnings: drivers.reduce((sum, d) => sum + d.totalEarnings, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPerformanceColor = (value: number, type: 'rating' | 'completion' | 'onTime') => {
    if (type === 'rating') {
      if (value >= 4.5) return 'text-success-600';
      if (value >= 4.0) return 'text-warning-600';
      return 'text-danger-600';
    }
    if (value >= 95) return 'text-success-600';
    if (value >= 85) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Comprehensive driver profiles, performance tracking, and management
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Break</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onBreak}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserX className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating?.toFixed(1) || '0.0'}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-break">On Break</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md ${
                viewMode === 'cards'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${
                viewMode === 'table'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current h-1 rounded-sm"></div>
                <div className="bg-current h-1 rounded-sm"></div>
                <div className="bg-current h-1 rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Driver Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => {
            const StatusIcon = statusIcons[driver.status];
            return (
              <div key={driver.id} className="card p-6 hover:shadow-lg transition-shadow">
                {/* Driver Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{driver.licenseNumber}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[driver.status]
                  }`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                  </span>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`font-semibold ${getPerformanceColor(driver.rating, 'rating')}`}>
                        {driver.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className={`font-semibold ${getPerformanceColor(driver.completionRate, 'completion')}`}>
                        {driver.completionRate}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Completion</p>
                  </div>
                </div>

                {/* Weekly Performance */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">This Week</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{driver.performance.weeklyTrips}</p>
                      <p className="text-xs text-gray-600">Trips</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(driver.performance.weeklyEarnings)}</p>
                      <p className="text-xs text-gray-600">Earnings</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                  {driver.currentVehicle && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Car className="h-4 w-4" />
                      <span>{driver.currentVehicle}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 btn btn-outline btn-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 btn btn-outline btn-sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Driver</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Rating</th>
                  <th className="table-head">Trips</th>
                  <th className="table-head">Earnings</th>
                  <th className="table-head">Vehicle</th>
                  <th className="table-head">Last Active</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => {
                  const StatusIcon = statusIcons[driver.status];
                  return (
                    <tr key={driver.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {driver.firstName} {driver.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{driver.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[driver.status]
                        }`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className={`font-medium ${getPerformanceColor(driver.rating, 'rating')}`}>
                            {driver.rating?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{driver.totalTrips}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{formatCurrency(driver.totalEarnings)}</span>
                      </td>
                      <td className="table-cell">
                        {driver.currentVehicle ? (
                          <div className="flex items-center space-x-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{driver.currentVehicle}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">
                          {formatDate(driver.lastActive)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first driver.'}
          </p>
        </div>
      )}
    </div>
  );
};