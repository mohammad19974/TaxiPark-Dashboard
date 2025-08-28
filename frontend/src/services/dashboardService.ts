import { AnalyticsService } from '../api/generated/services/AnalyticsService';
import * as Types from '../types';
type DashboardStats = Types.DashboardStats;
type RevenueData = Types.RevenueData;
type DriverPerformance = Types.DriverPerformance;
type VehicleUtilization = Types.VehicleUtilization;
type ApiResponse<T> = Types.ApiResponse<T>;

export const dashboardService = {
  async getDashboardStats() {
    return AnalyticsService.analyticsControllerGetDashboardStats();
  },

  async getRevenueData(period: string = '7d') {
    return AnalyticsService.analyticsControllerGetRevenueData(period);
  },

  async getDriverPerformance(limit: number = 10) {
    return AnalyticsService.analyticsControllerGetDriverPerformance(limit.toString());
  },

  async getVehicleUtilization(limit: number = 10) {
    return AnalyticsService.analyticsControllerGetVehicleUtilization(limit.toString());
  },

  async getRealtimeStats() {
    return AnalyticsService.analyticsControllerGetRealtimeStats();
  },
};