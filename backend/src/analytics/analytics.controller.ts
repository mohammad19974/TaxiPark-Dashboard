import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { 
  AnalyticsService,
  DashboardStats,
  RevenueData,
  DriverPerformance,
  VehicleUtilization
} from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getDashboardStats(): Promise<DashboardStats> {
    return this.analyticsService.getDashboardStats();
  }

  @Get('revenue')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getRevenueData(@Query('period') period?: string): Promise<RevenueData[]> {
    return this.analyticsService.getRevenueData(period);
  }

  @Get('driver-performance')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getDriverPerformance(@Query('limit') limit?: string): Promise<DriverPerformance[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.analyticsService.getDriverPerformance(limitNum);
  }

  @Get('vehicle-utilization')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getVehicleUtilization(@Query('limit') limit?: string): Promise<VehicleUtilization[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.analyticsService.getVehicleUtilization(limitNum);
  }

  @Get('realtime-stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getRealtimeStats(): Promise<DashboardStats> {
    return this.analyticsService.getRealtimeStats();
  }
}