import React from 'react';
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Activity,
  Clock,
} from 'lucide-react';
import { useDashboardStats, useRevenueData, useDriverPerformance, useVehicleUtilization } from '../api/hooks';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { DriverPerformanceTable } from '../components/dashboard/DriverPerformanceTable';
import { VehicleUtilizationChart } from '../components/dashboard/VehicleUtilizationChart';
import { RecentBookings } from '../components/dashboard/RecentBookings';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: driverPerformance, isLoading: driverLoading } = useDriverPerformance();
  const { data: vehicleUtilization, isLoading: vehicleLoading } = useVehicleUtilization();

  const isLoading = statsLoading || revenueLoading || driverLoading || vehicleLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>Error loading dashboard data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your taxi park today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value={stats?.totalBookings?.toLocaleString() || '0'}
          icon={Calendar}
          trend={{
            value: stats?.todayBookings || 0,
            label: 'Today',
            isPositive: true,
          }}
          className="bg-primary-50 border-primary-200"
        />
        
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          icon={DollarSign}
          trend={{
            value: stats?.todayRevenue || 0,
            label: 'Today',
            isPositive: true,
            prefix: '$',
          }}
          className="bg-success-50 border-success-200"
        />
        
        <StatsCard
          title="Active Drivers"
          value={stats?.activeDrivers?.toString() || '0'}
          icon={Users}
          trend={{
            value: stats?.completionRate || 0,
            label: 'Completion Rate',
            isPositive: true,
            suffix: '%',
          }}
          className="bg-warning-50 border-warning-200"
        />
        
        <StatsCard
          title="Available Vehicles"
          value={stats?.availableVehicles?.toString() || '0'}
          icon={Car}
          trend={{
            value: stats?.averageRating || 0,
            label: 'Avg Rating',
            isPositive: true,
            suffix: '★',
          }}
          className="bg-gray-50 border-gray-200"
        />
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-success-500" />
              <span className="text-sm text-success-600">+12.5%</span>
            </div>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        {/* Vehicle utilization */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Utilization</h3>
            <Activity className="h-4 w-4 text-primary-500" />
          </div>
          <VehicleUtilizationChart data={vehicleUtilization} />
        </div>
      </div>

      {/* Driver performance and recent bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver performance */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Drivers</h3>
            <Star className="h-4 w-4 text-warning-500" />
          </div>
          <DriverPerformanceTable data={driverPerformance} />
        </div>

        {/* Recent bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <Clock className="h-4 w-4 text-gray-500" />
          </div>
          <RecentBookings />
        </div>
      </div>
    </div>
  );
};