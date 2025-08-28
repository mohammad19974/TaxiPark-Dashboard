import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Users,
  Car,
  MapPin,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Building2,
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  driversCount: number;
  vehiclesCount: number;
  activeShifts: number;
  totalShifts: number;
  status: 'active' | 'inactive';
}

interface ShiftData {
  id: string;
  branchId: string;
  driverName: string;
  vehiclePlate: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'scheduled';
  earnings: number;
  trips: number;
}

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Downtown Branch',
    location: 'Downtown District',
    manager: 'John Smith',
    driversCount: 25,
    vehiclesCount: 20,
    activeShifts: 15,
    totalShifts: 25,
    status: 'active',
  },
  {
    id: '2',
    name: 'Airport Branch',
    location: 'Airport Terminal',
    manager: 'Sarah Johnson',
    driversCount: 18,
    vehiclesCount: 15,
    activeShifts: 12,
    totalShifts: 18,
    status: 'active',
  },
  {
    id: '3',
    name: 'Mall Branch',
    location: 'Shopping Mall',
    manager: 'Mike Wilson',
    driversCount: 12,
    vehiclesCount: 10,
    activeShifts: 8,
    totalShifts: 12,
    status: 'active',
  },
];

const mockShifts: ShiftData[] = [
  {
    id: '1',
    branchId: '1',
    driverName: 'Ahmed Hassan',
    vehiclePlate: 'ABC-123',
    startTime: '08:00',
    endTime: '16:00',
    status: 'active',
    earnings: 250,
    trips: 12,
  },
  {
    id: '2',
    branchId: '1',
    driverName: 'Mohamed Ali',
    vehiclePlate: 'XYZ-456',
    startTime: '16:00',
    endTime: '00:00',
    status: 'scheduled',
    earnings: 0,
    trips: 0,
  },
];

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
  completed: 'bg-primary-100 text-primary-800',
  scheduled: 'bg-warning-100 text-warning-800',
};

export const Shift: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'branches' | 'shifts'>('branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const filteredBranches = mockBranches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShifts = mockShifts.filter((shift) => {
    const matchesSearch = shift.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || shift.branchId === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const stats = {
    totalBranches: mockBranches.length,
    activeBranches: mockBranches.filter(b => b.status === 'active').length,
    totalDrivers: mockBranches.reduce((sum, b) => sum + b.driversCount, 0),
    activeShifts: mockBranches.reduce((sum, b) => sum + b.activeShifts, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage shifts across branches and monitor driver activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Shift
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBranches}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Building2 className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Branches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBranches}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeShifts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('branches')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'branches'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Branches
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shifts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Shifts
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'branches' ? 'Search branches...' : 'Search shifts...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full sm:w-64"
                />
              </div>
              
              {activeTab === 'shifts' && (
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="input w-full sm:w-auto"
                >
                  <option value="all">All Branches</option>
                  {mockBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Branches Tab */}
          {activeTab === 'branches' && (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Branch</th>
                    <th className="table-head">Manager</th>
                    <th className="table-head">Drivers</th>
                    <th className="table-head">Vehicles</th>
                    <th className="table-head">Active Shifts</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBranches.map((branch) => (
                    <tr key={branch.id} className="table-row">
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">{branch.name}</div>
                          <div className="text-sm text-gray-500">{branch.location}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{branch.manager}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{branch.driversCount}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{branch.vehiclesCount}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">
                          {branch.activeShifts}/{branch.totalShifts}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[branch.status]
                        }`}>
                          {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Shifts Tab */}
          {activeTab === 'shifts' && (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Driver</th>
                    <th className="table-head">Vehicle</th>
                    <th className="table-head">Shift Time</th>
                    <th className="table-head">Status</th>
                    <th className="table-head">Trips</th>
                    <th className="table-head">Earnings</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.map((shift) => (
                    <tr key={shift.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{shift.driverName}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{shift.vehiclePlate}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-900">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[shift.status]
                        }`}>
                          {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">{shift.trips}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-900">${shift.earnings}</span>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};