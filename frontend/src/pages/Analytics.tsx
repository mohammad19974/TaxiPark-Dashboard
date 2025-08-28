import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Calendar,
  Clock,
  Star,
  MapPin,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  change?: number;
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
}

const mockRevenueData: ChartData[] = [
  { label: 'Jan', value: 12500 },
  { label: 'Feb', value: 14200 },
  { label: 'Mar', value: 13800 },
  { label: 'Apr', value: 15600 },
  { label: 'May', value: 17200 },
  { label: 'Jun', value: 16800 },
  { label: 'Jul', value: 18500 },
  { label: 'Aug', value: 19200 },
  { label: 'Sep', value: 17800 },
  { label: 'Oct', value: 20100 },
  { label: 'Nov', value: 21500 },
  { label: 'Dec', value: 23200 },
];

const mockTripsData: ChartData[] = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 48 },
  { label: 'Thu', value: 61 },
  { label: 'Fri', value: 73 },
  { label: 'Sat', value: 89 },
  { label: 'Sun', value: 67 },
];

const mockDriverPerformance = [
  { name: 'John Smith', trips: 245, rating: 4.8, earnings: 12500, efficiency: 95 },
  { name: 'Sarah Johnson', trips: 189, rating: 4.9, earnings: 9800, efficiency: 98 },
  { name: 'Mike Davis', trips: 312, rating: 4.6, earnings: 15600, efficiency: 92 },
  { name: 'Emily Wilson', trips: 156, rating: 4.7, earnings: 7800, efficiency: 94 },
  { name: 'David Brown', trips: 203, rating: 4.5, earnings: 10200, efficiency: 89 },
];

const mockVehicleUtilization = [
  { vehicle: 'ABC-123', utilization: 85, trips: 45, revenue: 2250 },
  { vehicle: 'XYZ-789', utilization: 92, trips: 52, revenue: 2600 },
  { vehicle: 'DEF-456', utilization: 78, trips: 39, revenue: 1950 },
  { vehicle: 'GHI-789', utilization: 88, trips: 44, revenue: 2200 },
  { vehicle: 'JKL-012', utilization: 95, trips: 57, revenue: 2850 },
];

const mockHourlyData: ChartData[] = [
  { label: '6AM', value: 12 },
  { label: '7AM', value: 25 },
  { label: '8AM', value: 45 },
  { label: '9AM', value: 38 },
  { label: '10AM', value: 32 },
  { label: '11AM', value: 28 },
  { label: '12PM', value: 42 },
  { label: '1PM', value: 35 },
  { label: '2PM', value: 30 },
  { label: '3PM', value: 38 },
  { label: '4PM', value: 48 },
  { label: '5PM', value: 65 },
  { label: '6PM', value: 72 },
  { label: '7PM', value: 58 },
  { label: '8PM', value: 45 },
  { label: '9PM', value: 32 },
  { label: '10PM', value: 25 },
  { label: '11PM', value: 18 },
];

export const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [isLoading, setIsLoading] = useState(false);

  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: '$23,200',
      change: 12.5,
      changeLabel: 'vs last month',
      icon: DollarSign,
      color: 'success',
    },
    {
      title: 'Total Trips',
      value: '1,245',
      change: 8.2,
      changeLabel: 'vs last month',
      icon: Car,
      color: 'primary',
    },
    {
      title: 'Active Drivers',
      value: '24',
      change: -2.1,
      changeLabel: 'vs last month',
      icon: Users,
      color: 'warning',
    },
    {
      title: 'Avg Rating',
      value: '4.7',
      change: 3.2,
      changeLabel: 'vs last month',
      icon: Star,
      color: 'warning',
    },
    {
      title: 'Avg Trip Duration',
      value: '18 min',
      change: -5.8,
      changeLabel: 'vs last month',
      icon: Clock,
      color: 'primary',
    },
    {
      title: 'Fleet Utilization',
      value: '87%',
      change: 4.3,
      changeLabel: 'vs last month',
      icon: BarChart3,
      color: 'success',
    },
  ];

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // Simulate data export
    console.log('Exporting analytics data...');
  };

  const SimpleBarChart: React.FC<{ data: ChartData[]; height?: number }> = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="w-full bg-gray-200 rounded-t" style={{ height: height - 40 }}>
              <div
                className="bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                style={{
                  height: `${(item.value / maxValue) * (height - 40)}px`,
                  width: '100%',
                }}
                title={`${item.label}: ${item.value}`}
              ></div>
            </div>
            <span className="text-xs text-gray-600 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const SimpleLineChart: React.FC<{ data: ChartData[]; height?: number }> = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    
    return (
      <div className="relative" style={{ height }}>
        <svg width="100%" height={height - 40} className="overflow-visible">
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxValue - item.value) / range) * (height - 80) + 20;
              return `${x}%,${y}`;
            }).join(' ')}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - item.value) / range) * (height - 80) + 20;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
          })}
        </svg>
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-600 font-medium">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track performance metrics, analyze trends, and generate insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="btn btn-outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="btn btn-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-auto"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  metric.color === 'success' ? 'bg-success-100' :
                  metric.color === 'warning' ? 'bg-warning-100' :
                  metric.color === 'primary' ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    metric.color === 'success' ? 'text-success-600' :
                    metric.color === 'warning' ? 'text-warning-600' :
                    metric.color === 'primary' ? 'text-primary-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <div className="flex items-center mt-1">
                  <TrendIcon className={`h-3 w-3 mr-1 ${
                    isPositive ? 'text-success-500' : 'text-danger-500'
                  }`} />
                  <span className={`text-xs font-medium ${
                    isPositive ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">{metric.changeLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-success-500" />
              <span className="text-sm text-success-600">+12.5%</span>
            </div>
          </div>
          <SimpleBarChart data={mockRevenueData} height={250} />
        </div>

        {/* Daily Trips */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Trips</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary-500" />
              <span className="text-sm text-primary-600">+8.2%</span>
            </div>
          </div>
          <SimpleLineChart data={mockTripsData} height={250} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hourly Trip Distribution</h3>
            <Clock className="h-4 w-4 text-gray-500" />
          </div>
          <SimpleLineChart data={mockHourlyData} height={250} />
        </div>

        {/* Vehicle Utilization */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Utilization</h3>
            <Car className="h-4 w-4 text-gray-500" />
          </div>
          <div className="space-y-3">
            {mockVehicleUtilization.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Car className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900">{vehicle.vehicle}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{vehicle.trips} trips</p>
                    <p className="text-xs text-gray-600">${vehicle.revenue}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-primary-500 rounded-full"
                        style={{ width: `${vehicle.utilization}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-10">{vehicle.utilization}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Performance Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Driver Performance</h3>
          <Users className="h-4 w-4 text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Driver</th>
                <th className="table-head">Trips</th>
                <th className="table-head">Rating</th>
                <th className="table-head">Earnings</th>
                <th className="table-head">Efficiency</th>
                <th className="table-head">Performance</th>
              </tr>
            </thead>
            <tbody>
              {mockDriverPerformance.map((driver, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="font-medium text-gray-900">{driver.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-900">{driver.trips}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-warning-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-900">${driver.earnings.toLocaleString()}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            driver.efficiency >= 95 ? 'bg-success-500' :
                            driver.efficiency >= 90 ? 'bg-warning-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${driver.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{driver.efficiency}%</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      driver.efficiency >= 95 ? 'bg-success-100 text-success-800' :
                      driver.efficiency >= 90 ? 'bg-warning-100 text-warning-800' :
                      'bg-danger-100 text-danger-800'
                    }`}>
                      {driver.efficiency >= 95 ? 'Excellent' :
                       driver.efficiency >= 90 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};