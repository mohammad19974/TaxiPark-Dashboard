import React from 'react';
import { useUsers, useDrivers, useVehicles } from '../api/hooks';

/**
 * Example component demonstrating the usage of generated API hooks
 * This can be used as a reference for integrating the API hooks in other components
 */
export const ApiExample: React.FC = () => {
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: drivers, isLoading: driversLoading, error: driversError } = useDrivers();
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();

  if (usersLoading || driversLoading || vehiclesLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (usersError || driversError || vehiclesError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">API Error</h3>
        <p className="text-red-600 text-sm mt-1">
          {usersError?.message || driversError?.message || vehiclesError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">API Integration Example</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Users ({users?.length || 0})</h3>
            <div className="text-sm text-gray-600">
              {users?.length ? (
                <ul className="space-y-1">
                  {users.slice(0, 3).map((user: any, index: number) => (
                    <li key={index} className="truncate">
                      {user.firstName} {user.lastName}
                    </li>
                  ))}
                  {users.length > 3 && (
                    <li className="text-gray-400">+{users.length - 3} more...</li>
                  )}
                </ul>
              ) : (
                <p>No users found</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Drivers ({drivers?.length || 0})</h3>
            <div className="text-sm text-gray-600">
              {drivers?.length ? (
                <ul className="space-y-1">
                  {drivers.slice(0, 3).map((driver: any, index: number) => (
                    <li key={index} className="truncate">
                      {driver.firstName} {driver.lastName}
                    </li>
                  ))}
                  {drivers.length > 3 && (
                    <li className="text-gray-400">+{drivers.length - 3} more...</li>
                  )}
                </ul>
              ) : (
                <p>No drivers found</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Vehicles ({vehicles?.length || 0})</h3>
            <div className="text-sm text-gray-600">
              {vehicles?.length ? (
                <ul className="space-y-1">
                  {vehicles.slice(0, 3).map((vehicle: any, index: number) => (
                    <li key={index} className="truncate">
                      {vehicle.make} {vehicle.model}
                    </li>
                  ))}
                  {vehicles.length > 3 && (
                    <li className="text-gray-400">+{vehicles.length - 3} more...</li>
                  )}
                </ul>
              ) : (
                <p>No vehicles found</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Integration Status</h4>
          <div className="text-sm text-blue-700">
            <p>✅ API client generated successfully</p>
            <p>✅ React Query hooks configured</p>
            <p>✅ Authentication integration ready</p>
            <p>✅ Error handling implemented</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiExample;