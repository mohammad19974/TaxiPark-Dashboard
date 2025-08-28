import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/entities/user.entity';
import { Driver } from '../database/entities/driver.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { Booking } from '../database/entities/booking.entity';
import { Park } from '../database/entities/park.entity';
import { Customer } from '../database/entities/customer.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: configService.get<string>('DATABASE_PATH', './database.sqlite'),
  entities: [User, Driver, Vehicle, Booking, Park, Customer],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always use migrations for better control
  migrationsRun: true, // Automatically run migrations on startup
  logging: configService.get<string>('NODE_ENV') === 'development',
  autoLoadEntities: true,
});