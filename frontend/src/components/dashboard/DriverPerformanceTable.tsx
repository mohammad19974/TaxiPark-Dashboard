import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import * as Types from '../../types';
type DriverPerformance = Types.DriverPerformance;

interface DriverPerformanceTableProps {
  data: DriverPerformance[];
}

export const DriverPerformanceTable: React.FC<DriverPerformanceTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No driver performance data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-head">Driver</th>
            <th className="table-head">Trips</th>
            <th className="table-head">Revenue</th>
            <th className="table-head">Rating</th>
            <th className="table-head">Completion</th>
          </tr>
        </thead>
        <tbody>
          {data.map((driver, index) => (
            <tr key={driver.driverId} className="table-row">
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-primary-700">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {driver.driverName}
                    </p>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">
                    {driver.totalTrips.toLocaleString()}
                  </span>
                  <TrendingUp className="h-3 w-3 text-success-500 ml-1" />
                </div>
              </td>
              <td className="table-cell">
                <span className="text-sm font-medium text-gray-900">
                  ${driver.totalRevenue.toLocaleString()}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-warning-400 fill-current mr-1" />
                  <span className="text-sm text-gray-900">
                    {driver.rating.toFixed(1)}
                  </span>
                </div>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-success-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${driver.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {driver.completionRate}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};