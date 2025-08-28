import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Driver } from '../database/entities/driver.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { Booking } from '../database/entities/booking.entity';
import { Park } from '../database/entities/park.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver, Vehicle, Booking, Park]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}