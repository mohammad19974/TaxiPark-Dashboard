import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Star,
  Phone,
  Mail,
  Car,
  Clock,
  MoreVertical,
  Edit,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useDrivers } from '../api/hooks';

// Using the Driver type from the generated API types

// Mock drivers will be replaced by API data

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-danger-100 text-danger-800',
  on_trip: 'bg-blue-100 text-blue-800',
  offline: 'bg-warning-100 text-warning-800',
};

const statusIcons = {
  active: UserCheck,
  inactive: UserX,
  suspended: UserX,
  on_trip: Car,
  offline: Clock,
};

export const Drivers: React.FC = () => {
  const { data: driversData, isLoading, error } = useDrivers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const drivers = driversData || [];

  const filteredDrivers = drivers.filter((driver: any) => {
    const fullName = `${driver.firstName} ${driver.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: drivers.length,
    active: drivers.filter((d: any) => d.status === 'active').length,
    inactive: drivers.filter((d: any) => d.status === 'inactive').length,
    onTrip: drivers.filter((d: any) => d.status === 'on_trip').length,
    offline: drivers.filter((d: any) => d.status === 'offline').length,
    avgRating: drivers.length > 0 ? drivers.reduce((sum: number, d: any) => sum + d.rating, 0) / drivers.length : 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Drivers</h3>
          <p className="text-red-600 text-sm mt-1">
            {error.message || 'Failed to load drivers data'}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDriverName = (driver: any) => {
    return `${driver.firstName || ''} ${driver.lastName || ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage driver profiles, track performance, and monitor activity
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Trip</p>
              <p className="text-2xl font-bold text-gray-900">{stats.onTrip}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offline}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Star className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating?.toFixed(1) || '0.0'}</p>
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
              <option value="on_trip">On Trip</option>
                      <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
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
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
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

      {/* Driver Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver: any) => {
            const StatusIcon = statusIcons[driver.status as keyof typeof statusIcons] || statusIcons.inactive;
            return (
              <div key={driver.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {driver.profilePhoto ? (
                      <img
                        src={driver.profilePhoto}
                        alt={getDriverName(driver)}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{getDriverName(driver)}</h3>
                      <p className="text-sm text-gray-600">{driver.email}</p>
                      <p className="text-sm text-gray-600">{driver.phone}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[driver.status as keyof typeof statusColors] || statusColors.inactive
                    }`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-warning-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">License</span>
                    <span className="text-sm font-medium text-gray-900">{driver.licenseNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hired Date</span>
                    <span className="text-sm text-gray-900">{formatDate(driver.hiredDate)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Address</span>
                    <span className="text-sm text-gray-900 text-right">{driver.address}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Trips</p>
                        <p className="font-semibold text-gray-900">{driver.totalTrips}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Earnings</p>
                        <p className="font-semibold text-gray-900">${driver.totalEarnings?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Emergency Contact</p>
                      <p className="font-semibold text-gray-900">{driver.emergencyContact}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Emergency Phone</p>
                      <p className="font-semibold text-gray-900">{driver.emergencyPhone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 btn btn-outline btn-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button className="flex-1 btn btn-outline btn-sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
                
                <div className="mt-2 flex space-x-2">
                  <button className="flex-1 btn btn-outline btn-sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button className="flex-1 btn btn-outline btn-sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Driver</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Rating</th>
                  <th className="table-head">Vehicle</th>
                  <th className="table-head">Trips</th>
                  <th className="table-head">Earnings</th>
                  <th className="table-head">Hired Date</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver: any) => {
                  const StatusIcon = statusIcons[driver.status as keyof typeof statusIcons] || statusIcons.inactive;
                  return (
                    <tr key={driver.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{getDriverName(driver)}</p>
                            <p className="text-sm text-gray-600">{driver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[driver.status as keyof typeof statusColors] || statusColors.inactive
                        }`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-warning-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                        </div>
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
                        <span className="text-sm font-medium text-gray-900">{driver.totalTrips}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-medium text-gray-900">${driver.totalEarnings?.toLocaleString() || '0'}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{formatDate(driver.hiredDate)}</span>
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
                            <Phone className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Mail className="h-4 w-4 text-gray-400" />
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