import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Park } from './park.entity';
import { Driver } from './driver.entity';
import { Booking } from './booking.entity';

export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service',
  ON_TRIP = 'on_trip',
}

export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  MINIVAN = 'minivan',
  PICKUP = 'pickup',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plateNumber: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column()
  color: string;

  @Column({
    type: 'simple-enum',
    enum: VehicleType,
    default: VehicleType.SEDAN,
  })
  type: VehicleType;

  @Column({
    type: 'simple-enum',
    enum: FuelType,
    default: FuelType.PETROL,
  })
  fuelType: FuelType;

  @Column({ type: 'int' })
  seatingCapacity: number;

  @Column({ nullable: true })
  engineNumber: string;

  @Column({ nullable: true })
  chassisNumber: string;

  @Column({ type: 'date', nullable: true })
  registrationDate: Date;

  @Column({ type: 'date', nullable: true })
  insuranceExpiryDate: Date;

  @Column({ type: 'date', nullable: true })
  roadworthinessExpiryDate: Date;

  @Column({ type: 'int', default: 0 })
  mileage: number;

  @Column({
    type: 'simple-enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'int', default: 0 })
  totalTrips: number;

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  photos: string; // JSON string of photo URLs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Park, (park) => park.vehicles)
  @JoinColumn({ name: 'parkId' })
  park: Park;

  @Column({ nullable: true })
  parkId: string;

  @ManyToOne(() => Driver, (driver) => driver.assignedVehicles, { nullable: true })
  @JoinColumn({ name: 'assignedDriverId' })
  assignedDriver: Driver;

  @Column({ nullable: true })
  assignedDriverId: string | null;

  @OneToMany(() => Booking, (booking) => booking.vehicle)
  bookings: Booking[];

  // Virtual properties
  get photosList(): string[] {
    try {
      return this.photos ? JSON.parse(this.photos) : [];
    } catch {
      return [];
    }
  }

  set photosList(photos: string[]) {
    this.photos = JSON.stringify(photos);
  }

  get isInsuranceExpired(): boolean {
    return this.insuranceExpiryDate ? new Date(this.insuranceExpiryDate) < new Date() : false;
  }

  get isRoadworthinessExpired(): boolean {
    return this.roadworthinessExpiryDate ? new Date(this.roadworthinessExpiryDate) < new Date() : false;
  }

  get needsMaintenance(): boolean {
    return this.nextMaintenanceDate ? new Date(this.nextMaintenanceDate) <= new Date() : false;
  }

  get vehicleInfo(): string {
    return `${this.year} ${this.make} ${this.model} (${this.plateNumber})`;
  }
}