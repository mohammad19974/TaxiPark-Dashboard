import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Park } from './park.entity';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  bookingNumber: string;

  @Column()
  pickupLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  pickupLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  pickupLongitude: number;

  @Column()
  dropoffLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  dropoffLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  dropoffLongitude: number;

  @Column({ type: 'datetime' })
  scheduledPickupTime: Date;

  @Column({ type: 'datetime', nullable: true })
  actualPickupTime: Date;

  @Column({ type: 'datetime', nullable: true })
  actualDropoffTime: Date;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  estimatedDistance: number; // in kilometers

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  actualDistance: number; // in kilometers

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number; // in minutes

  @Column({ type: 'int', nullable: true })
  actualDuration: number; // in minutes

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  estimatedFare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualFare: number;

  @Column({ type: 'int', default: 1 })
  passengerCount: number;

  @Column({
    type: 'simple-enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'simple-enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'simple-enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  customerRating: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  driverRating: number;

  @Column({ type: 'text', nullable: true })
  customerFeedback: string;

  @Column({ type: 'text', nullable: true })
  driverFeedback: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'datetime', nullable: true })
  confirmedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Park, (park) => park.bookings)
  @JoinColumn({ name: 'parkId' })
  park: Park;

  @Column()
  parkId: string;

  @ManyToOne(() => Driver, (driver) => driver.bookings, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ nullable: true })
  driverId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.bookings, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column({ nullable: true })
  vehicleId: string;

  @ManyToOne(() => Customer, (customer) => customer.bookings)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @ManyToOne(() => User, (user) => user.bookingsCreated)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  // Virtual properties
  get isCompleted(): boolean {
    return this.status === BookingStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }

  get isInProgress(): boolean {
    return this.status === BookingStatus.IN_PROGRESS;
  }

  get totalDuration(): number | null {
    if (!this.actualPickupTime || !this.actualDropoffTime) return null;
    return Math.floor((this.actualDropoffTime.getTime() - this.actualPickupTime.getTime()) / (1000 * 60));
  }

  get isPaid(): boolean {
    return this.paymentStatus === PaymentStatus.PAID;
  }

  get isOverdue(): boolean {
    return this.scheduledPickupTime < new Date() && this.status === BookingStatus.PENDING;
  }
}