import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Park } from '../entities/park.entity';
import { Driver } from '../entities/driver.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Customer } from '../entities/customer.entity';
import { Booking } from '../entities/booking.entity';
import { Setting } from '../entities/setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Park,
      Driver,
      Vehicle,
      Customer,
      Booking,
      Setting,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}