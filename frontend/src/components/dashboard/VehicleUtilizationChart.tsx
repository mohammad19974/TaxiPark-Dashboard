import React from 'react';
import * as Types from '../../types';
type VehicleUtilization = Types.VehicleUtilization;

interface VehicleUtilizationChartProps {
  data: VehicleUtilization[];
}

export const VehicleUtilizationChart: React.FC<VehicleUtilizationChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No vehicle utilization data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Vehicle Utilization</h3>
      <div className="space-y-3">
        {data.map((vehicle) => (
          <div key={vehicle.vehicleId} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {vehicle.plateNumber}
              </span>
              <span className="text-gray-600">
                {vehicle.utilizationRate}% utilization
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {vehicle.totalTrips} trips • ${vehicle.revenue.toLocaleString()} revenue
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};