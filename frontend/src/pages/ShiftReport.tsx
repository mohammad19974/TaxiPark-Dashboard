import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Building2,
  Users,
  Car,
  FileText,
  Download,
  Filter,
  Search,
  TrendingUp,
  DollarSign,
  MapPin,
  BarChart3,
} from 'lucide-react';

interface ShiftReport {
  id: string;
  branchId: string;
  branchName: string;
  date: string;
  totalShifts: number;
  activeDrivers: number;
  totalTrips: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  peakHours: string;
  vehiclesUsed: number;
}

interface ReportFilters {
  startDate: string;
  endDate: string;
  branchId: string;
  reportType: 'daily' | 'weekly' | 'monthly';
}

const mockReports: ShiftReport[] = [
  {
    id: '1',
    branchId: '1',
    branchName: 'Downtown Branch',
    date: '2024-01-20',
    totalShifts: 25,
    activeDrivers: 22,
    totalTrips: 180,
    totalRevenue: 7200,
    averageRating: 4.6,
    completionRate: 96,
    peakHours: '08:00-10:00, 17:00-19:00',
    vehiclesUsed: 18,
  },
  {
    id: '2',
    branchId: '2',
    branchName: 'Airport Branch',
    date: '2024-01-20',
    totalShifts: 18,
    activeDrivers: 16,
    totalTrips: 145,
    totalRevenue: 6800,
    averageRating: 4.8,
    completionRate: 98,
    peakHours: '06:00-08:00, 20:00-22:00',
    vehiclesUsed: 14,
  },
  {
    id: '3',
    branchId: '3',
    branchName: 'Mall Branch',
    date: '2024-01-20',
    totalShifts: 12,
    activeDrivers: 11,
    totalTrips: 95,
    totalRevenue: 4200,
    averageRating: 4.4,
    completionRate: 94,
    peakHours: '12:00-14:00, 18:00-20:00',
    vehiclesUsed: 10,
  },
];

const branches = [
  { id: '1', name: 'Downtown Branch' },
  { id: '2', name: 'Airport Branch' },
  { id: '3', name: 'Mall Branch' },
];

export const ShiftReport: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    branchId: 'all',
    reportType: 'daily',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.branchName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filters.branchId === 'all' || report.branchId === filters.branchId;
    return matchesSearch && matchesBranch;
  });

  const totalStats = filteredReports.reduce(
    (acc, report) => ({
      totalShifts: acc.totalShifts + report.totalShifts,
      activeDrivers: acc.activeDrivers + report.activeDrivers,
      totalTrips: acc.totalTrips + report.totalTrips,
      totalRevenue: acc.totalRevenue + report.totalRevenue,
      vehiclesUsed: acc.vehiclesUsed + report.vehiclesUsed,
    }),
    { totalShifts: 0, activeDrivers: 0, totalTrips: 0, totalRevenue: 0, vehiclesUsed: 0 }
  );

  const averageRating = filteredReports.length > 0 
    ? filteredReports.reduce((sum, report) => sum + report.averageRating, 0) / filteredReports.length
    : 0;

  const averageCompletion = filteredReports.length > 0
    ? filteredReports.reduce((sum, report) => sum + report.completionRate, 0) / filteredReports.length
    : 0;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // In a real app, this would trigger a download or open a new tab with the report
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Reports</h1>
          <p className="mt-1 text-sm text-gray-600">
            Generate and analyze shift performance reports across branches
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="btn btn-primary"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Filters */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filters.branchId}
                onChange={(e) => setFilters({ ...filters, branchId: e.target.value })}
                className="input pl-10 w-full"
              >
                <option value="all">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filters.reportType}
                onChange={(e) => setFilters({ ...filters, reportType: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                className="input pl-10 w-full"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalShifts}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.activeDrivers}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalTrips}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalStats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Car className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vehicles Used</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.vehiclesUsed}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating?.toFixed(1) || '0.0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Performance Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Branch Performance</h3>
            <div className="mt-4 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Branch</th>
                <th className="table-head">Date</th>
                <th className="table-head">Shifts</th>
                <th className="table-head">Active Drivers</th>
                <th className="table-head">Trips</th>
                <th className="table-head">Revenue</th>
                <th className="table-head">Rating</th>
                <th className="table-head">Completion Rate</th>
                <th className="table-head">Peak Hours</th>
                <th className="table-head">Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{report.branchName}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">{formatDate(report.date)}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">{report.totalShifts}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{report.activeDrivers}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">{report.totalTrips}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(report.totalRevenue)}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        report.averageRating >= 4.5 ? 'bg-green-500' :
                        report.averageRating >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-900">{report.averageRating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            report.completionRate >= 95 ? 'bg-green-500' :
                            report.completionRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${report.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{report.completionRate}%</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{report.peakHours}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{report.vehiclesUsed}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filters.branchId !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Configure the report parameters above to generate reports.'}
          </p>
        </div>
      )}
    </div>
  );
};