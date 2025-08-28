import { DataSource } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Driver } from '../database/entities/driver.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { Booking } from '../database/entities/booking.entity';
import { Park } from '../database/entities/park.entity';
import { Customer } from '../database/entities/customer.entity';
import { Setting } from '../database/entities/setting.entity';
import { Notification } from '../database/entities/notification.entity';

export default new DataSource({
  type: 'sqlite',
  database: './database.sqlite',
  entities: [User, Driver, Vehicle, Booking, Park, Customer, Setting, Notification],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});