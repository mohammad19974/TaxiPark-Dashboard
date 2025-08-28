import React, { useState } from 'react';
import {
  Car,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  DollarSign,
} from 'lucide-react';
import { AddCarClassModal } from '../components/modals/AddCarClassModal';

interface CarClass {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
  capacity: number;
  features: string[];
  vehicleCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  image?: string;
}

const mockCarClasses: CarClass[] = [
  {
    id: '1',
    name: 'Economy',
    description: 'Affordable rides for everyday travel',
    basePrice: 5.00,
    pricePerKm: 1.20,
    pricePerMinute: 0.25,
    capacity: 4,
    features: ['Air Conditioning', 'Radio', 'Standard Seating'],
    vehicleCount: 45,
    status: 'active',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Comfort',
    description: 'Enhanced comfort for longer journeys',
    basePrice: 8.00,
    pricePerKm: 1.80,
    pricePerMinute: 0.35,
    capacity: 4,
    features: ['Premium AC', 'Leather Seats', 'Phone Charger', 'Water Bottle'],
    vehicleCount: 32,
    status: 'active',
    createdAt: '2023-02-20',
  },
  {
    id: '3',
    name: 'Premium',
    description: 'Luxury experience with top-tier vehicles',
    basePrice: 15.00,
    pricePerKm: 2.50,
    pricePerMinute: 0.50,
    capacity: 4,
    features: ['Luxury Interior', 'WiFi', 'Refreshments', 'Professional Driver'],
    vehicleCount: 18,
    status: 'active',
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    name: 'SUV',
    description: 'Spacious vehicles for groups and families',
    basePrice: 12.00,
    pricePerKm: 2.20,
    pricePerMinute: 0.45,
    capacity: 7,
    features: ['Extra Space', 'Luggage Capacity', 'Family Friendly', 'Safety Features'],
    vehicleCount: 25,
    status: 'active',
    createdAt: '2023-04-05',
  },
  {
    id: '5',
    name: 'Executive',
    description: 'Business class service for professionals',
    basePrice: 20.00,
    pricePerKm: 3.00,
    pricePerMinute: 0.60,
    capacity: 4,
    features: ['Business Amenities', 'Silent Ride', 'Newspaper', 'Meeting Space'],
    vehicleCount: 12,
    status: 'inactive',
    createdAt: '2023-05-15',
  },
  {
    id: '6',
    name: 'Electric',
    description: 'Eco-friendly electric vehicles',
    basePrice: 7.00,
    pricePerKm: 1.50,
    pricePerMinute: 0.30,
    capacity: 4,
    features: ['Zero Emissions', 'Quiet Ride', 'Modern Tech', 'Eco Friendly'],
    vehicleCount: 20,
    status: 'active',
    createdAt: '2023-06-01',
  },
];

const statusColors = {
  active: 'bg-success-100 text-success-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export const CarClasses: React.FC = () => {
  const [carClasses, setCarClasses] = useState<CarClass[]>(mockCarClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCarClasses = carClasses.filter((carClass) => {
    const matchesSearch = carClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carClass.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || carClass.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCarClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCarClasses = filteredCarClasses.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: carClasses.length,
    active: carClasses.filter(c => c.status === 'active').length,
    inactive: carClasses.filter(c => c.status === 'inactive').length,
    totalVehicles: carClasses.reduce((sum, c) => sum + c.vehicleCount, 0),
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddCarClass = (newCarClass: any) => {
    const carClass: CarClass = {
      ...newCarClass,
      id: Date.now().toString(),
      vehicleCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCarClasses(prev => [...prev, carClass]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Classes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage vehicle categories, pricing, and service tiers
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Car Class
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
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
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
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Car className="h-6 w-6 text-gray-600" />
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
              <DollarSign className="h-6 w-6 text-blue-600" />
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
                placeholder="Search car classes..."
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

      {/* Car Classes Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Class Name</th>
                <th className="table-head">Description</th>
                <th className="table-head">Pricing</th>
                <th className="table-head">Capacity</th>
                <th className="table-head">Vehicles</th>
                <th className="table-head">Status</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCarClasses.map((carClass) => {
                return (
                  <tr key={carClass.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          <Car className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {carClass.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created {new Date(carClass.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {carClass.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {carClass.features.slice(0, 2).join(', ')}
                        {carClass.features.length > 2 && ` +${carClass.features.length - 2} more`}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          Base: ${carClass.basePrice?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-gray-500">
                          ${carClass.pricePerKm?.toFixed(2) || '0.00'}/km
                        </div>
                        <div className="text-gray-500">
                          ${carClass.pricePerMinute?.toFixed(2) || '0.00'}/min
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {carClass.capacity} passengers
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {carClass.vehicleCount}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[carClass.status]
                      }`}>
                        {carClass.status}
                      </span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCarClasses.length)} of {filteredCarClasses.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {filteredCarClasses.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No car classes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first car class.'}
          </p>
        </div>
      )}

      {/* Add Car Class Modal */}
      <AddCarClassModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCarClass}
      />
    </div>
  );
};