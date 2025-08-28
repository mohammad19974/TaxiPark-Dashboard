import React, { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  MapPin,
  Wrench,
  Battery,
  User,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { useVehicles } from '../api/hooks';

// Vehicle interface
interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  status: VehicleStatus;
  driverName?: string;
  location: string;
  fuelLevel?: number;
  totalTrips?: number;
  revenue?: number;
}

type VehicleStatus = 'available' | 'in-use' | 'maintenance' | 'offline';

const statusColors: Record<VehicleStatus, string> = {
  available: 'bg-success-100 text-success-800',
  'in-use': 'bg-primary-100 text-primary-800',
  maintenance: 'bg-warning-100 text-warning-800',
  offline: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<VehicleStatus, React.ComponentType<any>> = {
  available: Car,
  'in-use': MapPin,
  maintenance: Wrench,
  offline: Battery,
};

export const Fleet: React.FC = () => {
  const { data: vehicles = [], isLoading, error } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vehicles...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading vehicles</div>
      </div>
    );
  }

  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v: Vehicle) => v.status === 'available').length,
    inUse: vehicles.filter((v: Vehicle) => v.status === 'in-use').length,
    maintenance: vehicles.filter((v: Vehicle) => v.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your vehicle fleet, track status, and monitor performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Car className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Car className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Use</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inUse}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Wrench className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
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
                placeholder="Search vehicles..."
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
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
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

      {/* Vehicle Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle: Vehicle) => {
            const StatusIcon = statusIcons[vehicle.status as VehicleStatus] || Car;
            return (
              <div key={vehicle.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Car className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.plateNumber}</h3>
                      <p className="text-sm text-gray-600">{vehicle.model} ({vehicle.year})</p>
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
                      statusColors[vehicle.status as VehicleStatus] || 'bg-gray-100 text-gray-800'
                    }`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </div>
                  
                  {vehicle.driverName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Driver</span>
                      <span className="text-sm font-medium text-gray-900">{vehicle.driverName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm text-gray-900">{vehicle.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fuel Level</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (vehicle.fuelLevel || 0) > 50 ? 'bg-success-500' :
                            (vehicle.fuelLevel || 0) > 25 ? 'bg-warning-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${vehicle.fuelLevel || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{vehicle.fuelLevel || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-600">Total Trips</p>
                        <p className="font-semibold text-gray-900">{vehicle.totalTrips || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-semibold text-gray-900">${vehicle.revenue?.toLocaleString() || '0'}</p>
                      </div>
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
                  <th className="table-head">Vehicle</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Driver</th>
                  <th className="table-head">Location</th>
                  <th className="table-head">Fuel</th>
                  <th className="table-head">Trips</th>
                  <th className="table-head">Revenue</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle: Vehicle) => {
                  const StatusIcon = statusIcons[vehicle.status as VehicleStatus] || Car;
                  return (
                    <tr key={vehicle.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Car className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{vehicle.plateNumber}</p>
                            <p className="text-sm text-gray-600">{vehicle.model} ({vehicle.year})</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[vehicle.status as VehicleStatus] || 'bg-gray-100 text-gray-800'
                        }`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                        </span>
                      </td>
                      <td className="table-cell">
                        {vehicle.driverName ? (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{vehicle.driverName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{vehicle.location}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (vehicle.fuelLevel || 0) > 50 ? 'bg-success-500' :
                                (vehicle.fuelLevel || 0) > 25 ? 'bg-warning-500' : 'bg-danger-500'
                              }`}
                              style={{ width: `${vehicle.fuelLevel || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{vehicle.fuelLevel || 0}%</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-medium text-gray-900">{vehicle.totalTrips || 0}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-medium text-gray-900">${vehicle.revenue?.toLocaleString() || '0'}</span>
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
                            <Trash2 className="h-4 w-4 text-gray-400" />
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
      
      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first vehicle.'}
          </p>
        </div>
      )}
    </div>
  );
};