import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
import { Setting } from './setting.entity';

export enum ParkStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('parks')
export class Park {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({
    type: 'simple-enum',
    enum: ParkStatus,
    default: ParkStatus.ACTIVE,
  })
  status: ParkStatus;

  @Column({ nullable: true })
  managerName: string;

  @Column({ nullable: true })
  managerPhone: string;

  @Column({ type: 'text', nullable: true })
  facilities: string; // JSON string of facilities array

  @Column({ type: 'text', nullable: true })
  operatingHours: string; // JSON string of operating hours

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Driver, (driver) => driver.park)
  drivers: Driver[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.park)
  vehicles: Vehicle[];

  @OneToMany(() => Booking, (booking) => booking.park)
  bookings: Booking[];

  @OneToMany(() => Setting, (setting) => setting.park)
  settings: Setting[];

  // Virtual properties
  get facilitiesList(): string[] {
    try {
      return this.facilities ? JSON.parse(this.facilities) : [];
    } catch {
      return [];
    }
  }

  set facilitiesList(facilities: string[]) {
    this.facilities = JSON.stringify(facilities);
  }

  get operatingHoursData(): any {
    try {
      return this.operatingHours ? JSON.parse(this.operatingHours) : {};
    } catch {
      return {};
    }
  }

  set operatingHoursData(hours: any) {
    this.operatingHours = JSON.stringify(hours);
  }
}