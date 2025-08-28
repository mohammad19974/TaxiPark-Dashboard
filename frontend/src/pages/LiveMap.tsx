import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Users,
  Clock,
  Filter,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  Eye,
  Phone,
} from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  driverName: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number;
  heading: number;
  lastUpdate: string;
  currentTrip?: {
    id: string;
    pickup: string;
    destination: string;
    estimatedArrival: string;
  };
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: 'ABC-123',
    driverName: 'Ahmed Hassan',
    status: 'busy',
    location: {
      lat: 24.7136,
      lng: 46.6753,
      address: 'King Fahd Road, Riyadh',
    },
    speed: 45,
    heading: 180,
    lastUpdate: '2024-01-20T10:30:00Z',
    currentTrip: {
      id: 'trip-001',
      pickup: 'Riyadh Airport',
      destination: 'King Khalid University',
      estimatedArrival: '11:15 AM',
    },
  },
  {
    id: '2',
    plateNumber: 'XYZ-456',
    driverName: 'Mohamed Ali',
    status: 'available',
    location: {
      lat: 24.7242,
      lng: 46.6845,
      address: 'Olaya Street, Riyadh',
    },
    speed: 0,
    heading: 0,
    lastUpdate: '2024-01-20T10:28:00Z',
  },
  {
    id: '3',
    plateNumber: 'DEF-789',
    driverName: 'Sarah Johnson',
    status: 'busy',
    location: {
      lat: 24.7000,
      lng: 46.6900,
      address: 'Al Malaz District, Riyadh',
    },
    speed: 35,
    heading: 90,
    lastUpdate: '2024-01-20T10:29:00Z',
    currentTrip: {
      id: 'trip-002',
      pickup: 'Riyadh Mall',
      destination: 'King Saud University',
      estimatedArrival: '11:00 AM',
    },
  },
];

const statusColors = {
  available: 'bg-success-100 text-success-800',
  busy: 'bg-warning-100 text-warning-800',
  offline: 'bg-gray-100 text-gray-800',
};

const statusDotColors = {
  available: 'bg-success-500',
  busy: 'bg-warning-500',
  offline: 'bg-gray-500',
};

export const LiveMap: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In a real app, this would fetch live data from the API
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'available').length,
    busy: vehicles.filter(v => v.status === 'busy').length,
    offline: vehicles.filter(v => v.status === 'offline').length,
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
          <p className="mt-1 text-sm text-gray-600">
            Real-time vehicle tracking and fleet monitoring
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handleRefresh}
            className="btn btn-outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="btn btn-outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
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
            <div className="p-2 bg-warning-100 rounded-lg">
              <Navigation className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Trip</p>
              <p className="text-2xl font-bold text-gray-900">{stats.busy}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Car className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className={`${isFullscreen ? 'lg:col-span-3' : 'lg:col-span-2'} card p-0 overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Live Vehicle Tracking</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 text-gray-400" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="relative bg-gray-100 h-96 lg:h-[500px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Interactive Map</p>
              <p className="text-sm text-gray-500 mt-1">
                Real-time vehicle locations would be displayed here
              </p>
            </div>
            
            {/* Vehicle Markers Simulation */}
            <div className="absolute top-20 left-20">
              <div className="relative">
                <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                <div className="absolute -top-8 -left-6 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  ABC-123
                </div>
              </div>
            </div>
            
            <div className="absolute top-32 right-32">
              <div className="relative">
                <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse"></div>
                <div className="absolute -top-8 -left-6 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  XYZ-456
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-20 left-1/2">
              <div className="relative">
                <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse"></div>
                <div className="absolute -top-8 -left-6 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                  DEF-789
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        {!isFullscreen && (
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filter */}
            <div className="card p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input w-full"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="busy">On Trip</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Vehicle List */}
            <div className="space-y-3">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`card p-4 cursor-pointer transition-all ${
                    selectedVehicle?.id === vehicle.id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Car className="h-6 w-6 text-gray-600" />
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusDotColors[vehicle.status]}`}></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{vehicle.plateNumber}</h4>
                        <p className="text-sm text-gray-600">{vehicle.driverName}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[vehicle.status]
                    }`}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{vehicle.location.address}</span>
                    </div>
                    
                    {vehicle.status === 'busy' && vehicle.speed > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Navigation className="h-4 w-4" />
                        <span>{vehicle.speed} km/h</span>
                      </div>
                    )}
                    
                    {vehicle.currentTrip && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-xs font-medium text-gray-700">Current Trip</p>
                        <p className="text-xs text-gray-600 truncate">
                          {vehicle.currentTrip.pickup} → {vehicle.currentTrip.destination}
                        </p>
                        <p className="text-xs text-gray-500">
                          ETA: {vehicle.currentTrip.estimatedArrival}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 btn btn-outline btn-sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Track
                    </button>
                    <button className="flex-1 btn btn-outline btn-sm">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Vehicle Details */}
      {selectedVehicle && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Vehicle Details - {selectedVehicle.plateNumber}
            </h3>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Driver Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Name:</span> {selectedVehicle.driverName}</p>
                <p><span className="text-gray-600">Status:</span> 
                  <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[selectedVehicle.status]
                  }`}>
                    {selectedVehicle.status.charAt(0).toUpperCase() + selectedVehicle.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Location</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-600">Address:</span> {selectedVehicle.location.address}</p>
                <p><span className="text-gray-600">Coordinates:</span> {selectedVehicle.location?.lat?.toFixed(4) || '0.0000'}, {selectedVehicle.location?.lng?.toFixed(4) || '0.0000'}</p>
                <p><span className="text-gray-600">Speed:</span> {selectedVehicle.speed} km/h</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trip Information</h4>
              {selectedVehicle.currentTrip ? (
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Trip ID:</span> {selectedVehicle.currentTrip.id}</p>
                  <p><span className="text-gray-600">From:</span> {selectedVehicle.currentTrip.pickup}</p>
                  <p><span className="text-gray-600">To:</span> {selectedVehicle.currentTrip.destination}</p>
                  <p><span className="text-gray-600">ETA:</span> {selectedVehicle.currentTrip.estimatedArrival}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No active trip</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};