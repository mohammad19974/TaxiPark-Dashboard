import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Driver, DriverStatus } from '../database/entities/driver.entity';
import { Vehicle, VehicleStatus } from '../database/entities/vehicle.entity';
import { Booking, BookingStatus } from '../database/entities/booking.entity';
import { Park } from '../database/entities/park.entity';

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  todayRevenue: number;
  activeDrivers: number;
  availableVehicles: number;
  completionRate: number;
  averageRating: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface DriverPerformance {
  id: string;
  name: string;
  totalTrips: number;
  totalRevenue: number;
  rating: number;
  completionRate: number;
}

export interface VehicleUtilization {
  id: string;
  plateNumber: string;
  type: string;
  utilizationRate: number;
  totalTrips: number;
  revenue: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Park)
    private readonly parkRepository: Repository<Park>,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total bookings
    const totalBookings = await this.bookingRepository.count();
    
    // Get today's bookings
    const todayBookings = await this.bookingRepository.count({
      where: {
        createdAt: Between(today, tomorrow),
      },
    });

    // Get total revenue from completed bookings
    const completedBookings = await this.bookingRepository.find({
      where: { status: BookingStatus.COMPLETED },
    });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.actualFare || 0), 0);

    // Get today's revenue
    const todayCompletedBookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.COMPLETED,
        createdAt: Between(today, tomorrow),
      },
    });
    const todayRevenue = todayCompletedBookings.reduce((sum, booking) => sum + (booking.actualFare || 0), 0);

    // Get active drivers
    const activeDrivers = await this.driverRepository.count({
      where: { status: DriverStatus.ACTIVE },
    });

    // Get available vehicles
    const availableVehicles = await this.vehicleRepository.count({
      where: { status: VehicleStatus.ACTIVE },
    });

    // Calculate completion rate
    const completedCount = await this.bookingRepository.count({
      where: { status: BookingStatus.COMPLETED },
    });
    const completionRate = totalBookings > 0 ? (completedCount / totalBookings) * 100 : 0;

    // Calculate average rating (mock for now)
    const averageRating = 4.5;

    return {
      totalBookings,
      todayBookings,
      totalRevenue,
      todayRevenue,
      activeDrivers,
      availableVehicles,
      completionRate: Math.round(completionRate * 100) / 100,
      averageRating,
    };
  }

  async getRevenueData(period: string = '7d'): Promise<RevenueData[]> {
    const days = period === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenueData: RevenueData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayBookings = await this.bookingRepository.find({
        where: {
          status: BookingStatus.COMPLETED,
          createdAt: Between(date, nextDate),
        },
      });

      const revenue = dayBookings.reduce(
        (sum, booking) => sum + (booking.actualFare || 0),
        0,
      );
      
      revenueData.push({
        date: date.toISOString().split('T')[0],
        revenue,
        bookings: dayBookings.length,
      });
    }

    return revenueData;
  }

  async getDriverPerformance(limit: number = 10): Promise<DriverPerformance[]> {
    try {
      // Get drivers without complex relations to avoid circular reference issues
      const drivers = await this.driverRepository.find({
        take: limit,
        order: { totalTrips: 'DESC' },
      });

      const performance: DriverPerformance[] = [];

      for (const driver of drivers) {
        // Get booking stats separately to avoid relation issues
        const completedBookings = await this.bookingRepository.count({
          where: {
            driverId: driver.id,
            status: BookingStatus.COMPLETED,
          },
        });

        const totalBookings = await this.bookingRepository.count({
          where: { driverId: driver.id },
        });

        const revenueResult = await this.bookingRepository
          .createQueryBuilder('booking')
          .select('SUM(booking.actualFare)', 'totalRevenue')
          .where('booking.driverId = :driverId', { driverId: driver.id })
          .andWhere('booking.status = :status', {
            status: BookingStatus.COMPLETED,
          })
          .getRawOne();

        const totalRevenue = parseFloat(
          String((revenueResult as { totalRevenue?: string })?.totalRevenue || '0'),
        );
        const completionRate =
          totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

        performance.push({
          id: driver.id,
          name:
            driver.firstName && driver.lastName
              ? `${driver.firstName} ${driver.lastName}`
              : `Driver ${driver.licenseNumber}`,
          totalTrips: completedBookings,
          totalRevenue,
          rating: driver.rating || 4.5,
          completionRate: Math.round(completionRate * 100) / 100,
        });
      }

      return performance.sort((a, b) => b.totalRevenue - a.totalRevenue);
    } catch (error) {
      console.error('Error fetching driver performance:', error);
      // Return empty array with proper structure on error
      return [];
    }
  }

  async getVehicleUtilization(
    limit: number = 10,
  ): Promise<VehicleUtilization[]> {
    const vehicles = await this.vehicleRepository.find({
      relations: ['bookings'],
      take: limit,
    });

    const utilization: VehicleUtilization[] = [];

    for (const vehicle of vehicles) {
      const completedBookings =
        vehicle.bookings?.filter((b) => b.status === BookingStatus.COMPLETED) ||
        [];
      const totalTrips = completedBookings.length;
      const revenue = completedBookings.reduce(
        (sum, booking) => sum + (booking.actualFare || 0),
        0,
      );
      
      // Calculate utilization rate (mock calculation based on trips)
      const utilizationRate = Math.min(totalTrips * 5, 100); // 5% per trip, max 100%

      utilization.push({
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        type: vehicle.type,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        totalTrips,
        revenue,
      });
    }

    return utilization.sort((a, b) => b.utilizationRate - a.utilizationRate);
  }

  async getRealtimeStats(): Promise<DashboardStats> {
    // For now, return the same as dashboard stats
    // In a real implementation, this would include WebSocket updates
    return this.getDashboardStats();
  }
}