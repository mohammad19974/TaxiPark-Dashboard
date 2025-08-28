import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AuthService,
  UsersService,
  DriversService,
  VehiclesService,
  BookingsService,
  ParksService,
  AnalyticsService,
} from '../generated';
import type {
  CreateUserDto,
  UpdateUserDto,
  CreateDriverDto,
  UpdateDriverDto,
  CreateVehicleDto,
  UpdateVehicleDto,
  CreateBookingDto,
  UpdateBookingDto,
  CreateParkDto,
  UpdateParkDto,
} from '../generated';

// Query Keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  drivers: ['drivers'] as const,
  driver: (id: string) => ['drivers', id] as const,
  vehicles: ['vehicles'] as const,
  vehicle: (id: string) => ['vehicles', id] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  parks: ['parks'] as const,
  park: (id: string) => ['parks', id] as const,
  analytics: {
    dashboardStats: ['analytics', 'dashboard-stats'] as const,
    revenueData: ['analytics', 'revenue-data'] as const,
    driverPerformance: ['analytics', 'driver-performance'] as const,
    vehicleUtilization: ['analytics', 'vehicle-utilization'] as const,
    realtimeStats: ['analytics', 'realtime-stats'] as const,
  },
};

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      AuthService.postAuthLogin(credentials),
  });
};

// Users Hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => UsersService.usersControllerFindAll('', ''),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: CreateUserDto) => UsersService.usersControllerCreate(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserDto }) =>
      UsersService.usersControllerUpdate(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => UsersService.usersControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

// Drivers Hooks
export const useDrivers = () => {
  return useQuery({
    queryKey: queryKeys.drivers,
    queryFn: () => DriversService.driversControllerFindAll('', '', ''),
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (driverData: CreateDriverDto) => DriversService.driversControllerCreate(driverData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers });
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, driverData }: { id: string; driverData: UpdateDriverDto }) =>
      DriversService.driversControllerUpdate(id, driverData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers });
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DriversService.driversControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers });
    },
  });
};

// Vehicles Hooks
export const useVehicles = () => {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: () => VehiclesService.vehiclesControllerFindAll('', '', ''),
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleData: CreateVehicleDto) => VehiclesService.vehiclesControllerCreate(vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vehicleData }: { id: string; vehicleData: UpdateVehicleDto }) =>
      VehiclesService.vehiclesControllerUpdate(id, vehicleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => VehiclesService.vehiclesControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
};

// Bookings Hooks
export const useBookings = () => {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: () => BookingsService.bookingsControllerFindAll('', '', '', '', '', ''),
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData: CreateBookingDto) => BookingsService.bookingsControllerCreate(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookingData }: { id: string; bookingData: UpdateBookingDto }) =>
      BookingsService.bookingsControllerUpdate(id, bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingsService.bookingsControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
};

// Parks Hooks
export const useParks = () => {
  return useQuery({
    queryKey: queryKeys.parks,
    queryFn: () => ParksService.parksControllerFindAll(''),
  });
};

export const useCreatePark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (parkData: CreateParkDto) => ParksService.parksControllerCreate(parkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parks });
    },
  });
};

export const useUpdatePark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parkData }: { id: string; parkData: UpdateParkDto }) =>
      ParksService.parksControllerUpdate(id, parkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parks });
    },
  });
};

export const useDeletePark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ParksService.parksControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parks });
    },
  });
};

// Analytics Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.analytics.dashboardStats,
    queryFn: () => AnalyticsService.analyticsControllerGetDashboardStats(),
  });
};

export const useRevenueData = () => {
  return useQuery({
    queryKey: queryKeys.analytics.revenueData,
    queryFn: () => AnalyticsService.analyticsControllerGetRevenueData(),
  });
};

export const useDriverPerformance = () => {
  return useQuery({
    queryKey: queryKeys.analytics.driverPerformance,
    queryFn: () => AnalyticsService.analyticsControllerGetDriverPerformance(),
  });
};

export const useVehicleUtilization = () => {
  return useQuery({
    queryKey: queryKeys.analytics.vehicleUtilization,
    queryFn: () => AnalyticsService.analyticsControllerGetVehicleUtilization(),
  });
};

export const useRealtimeStats = () => {
  return useQuery({
    queryKey: queryKeys.analytics.realtimeStats,
    queryFn: () => AnalyticsService.analyticsControllerGetRealtimeStats(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });
};