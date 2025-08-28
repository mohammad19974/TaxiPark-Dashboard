import { create } from 'zustand';
import * as Types from '../types';
type DashboardStats = Types.DashboardStats;
type RevenueData = Types.RevenueData;
type DriverPerformance = Types.DriverPerformance;
type VehicleUtilization = Types.VehicleUtilization;
import { dashboardService } from '../services/dashboardService';

interface DashboardStore {
  stats: DashboardStats | null;
  revenueData: RevenueData[];
  driverPerformance: DriverPerformance[];
  vehicleUtilization: VehicleUtilization[];
  isLoading: boolean;
  error: string | null;
  
  fetchStats: () => Promise<void>;
  fetchRevenueData: (period: string) => Promise<void>;
  fetchDriverPerformance: () => Promise<void>;
  fetchVehicleUtilization: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  revenueData: [],
  driverPerformance: [],
  vehicleUtilization: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const stats = await dashboardService.getDashboardStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
        isLoading: false 
      });
    }
  },

  fetchRevenueData: async (period: string) => {
    try {
      set({ isLoading: true, error: null });
      const revenueData = await dashboardService.getRevenueData(period);
      set({ revenueData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch revenue data',
        isLoading: false 
      });
    }
  },

  fetchDriverPerformance: async () => {
    try {
      set({ isLoading: true, error: null });
      const driverPerformance = await dashboardService.getDriverPerformance();
      set({ driverPerformance, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch driver performance',
        isLoading: false 
      });
    }
  },

  fetchVehicleUtilization: async () => {
    try {
      set({ isLoading: true, error: null });
      const vehicleUtilization = await dashboardService.getVehicleUtilization();
      set({ vehicleUtilization, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch vehicle utilization',
        isLoading: false 
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));