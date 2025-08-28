import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Users,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { AddModeratorModal } from '../components/modals/AddModeratorModal';

interface Moderator {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  location: string;
  status: 'active' | 'inactive';
  joinDate: string;
  totalDrivers: number;
  totalVehicles: number;
  avatar?: string;
}

const mockModerators: Moderator[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@taxipark.com',
    phone: '+1 (555) 123-4567',
    branch: 'Downtown Branch',
    location: 'New York, NY',
    status: 'active',
    joinDate: '2023-01-15',
    totalDrivers: 45,
    totalVehicles: 38,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@taxipark.com',
    phone: '+1 (555) 234-5678',
    branch: 'Airport Branch',
    location: 'Queens, NY',
    status: 'active',
    joinDate: '2023-02-20',
    totalDrivers: 32,
    totalVehicles: 28,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@taxipark.com',
    phone: '+1 (555) 345-6789',
    branch: 'Uptown Branch',
    location: 'Manhattan, NY',
    status: 'inactive',
    joinDate: '2022-11-10',
    totalDrivers: 28,
    totalVehicles: 25,
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@taxipark.com',
    phone: '+1 (555) 456-7890',
    branch: 'Brooklyn Branch',
    location: 'Brooklyn, NY',
    status: 'active',
    joinDate: '2023-03-05',
    totalDrivers: 52,
    totalVehicles: 41,
  },
];

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export const Branches: React.FC = () => {
  const [moderators, setModerators] = useState<Moderator[]>(mockModerators);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredModerators = moderators.filter((moderator) => {
    const matchesSearch = moderator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         moderator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         moderator.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || moderator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddModerator = (newModerator: any) => {
    const moderator: Moderator = {
      ...newModerator,
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0],
    };
    setModerators(prev => [...prev, moderator]);
  };

  const stats = {
    total: moderators.length,
    active: moderators.filter(m => m.status === 'active').length,
    inactive: moderators.filter(m => m.status === 'inactive').length,
    totalDrivers: moderators.reduce((sum, m) => sum + m.totalDrivers, 0),
    totalVehicles: moderators.reduce((sum, m) => sum + m.totalVehicles, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage branch moderators and monitor branch performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Moderator
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Moderators</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-6 w-6 text-gray-600" />
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
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
                placeholder="Search moderators..."
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
            </select>
          </div>
        </div>
      </div>

      {/* Moderators Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Moderator</th>
                <th className="table-head">Branch</th>
                <th className="table-head">Location</th>
                <th className="table-head">Status</th>
                <th className="table-head">Drivers</th>
                <th className="table-head">Vehicles</th>
                <th className="table-head">Join Date</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModerators.map((moderator) => {
                return (
                  <tr key={moderator.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {moderator.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {moderator.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {moderator.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {moderator.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {moderator.branch}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {moderator.location}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[moderator.status]
                      }`}>
                        {moderator.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {moderator.totalDrivers}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {moderator.totalVehicles}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-500">
                        {new Date(moderator.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
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
      
      {filteredModerators.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No moderators found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first moderator.'}
          </p>
        </div>
      )}

      {/* Add Moderator Modal */}
      <AddModeratorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddModerator}
      />
    </div>
  );
};