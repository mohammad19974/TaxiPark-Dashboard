import React from 'react';
import * as Types from '../../types';
type RevenueData = Types.RevenueData;

interface RevenueChartProps {
  data: RevenueData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No revenue data available</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxBookings = Math.max(...data.map(d => d.bookings));

  return (
    <div className="space-y-4">
      {/* Chart legend */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Bookings</span>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const revenuePercentage = (item.revenue / maxRevenue) * 100;
          const bookingsPercentage = (item.bookings / maxBookings) * 100;
          const date = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{date}</span>
                <div className="flex space-x-4">
                  <span>${item.revenue.toLocaleString()}</span>
                  <span>{item.bookings} bookings</span>
                </div>
              </div>
              
              {/* Revenue bar */}
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${revenuePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Bookings bar */}
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div
                    className="bg-success-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${bookingsPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Revenue</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {data.reduce((sum, item) => sum + item.bookings, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};