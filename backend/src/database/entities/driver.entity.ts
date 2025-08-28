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
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';

export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ON_TRIP = 'on_trip',
  AVAILABLE = 'available',
}

export enum LicenseClass {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({
    type: 'simple-enum',
    enum: LicenseClass,
    default: LicenseClass.B,
  })
  licenseClass: LicenseClass;

  @Column({ type: 'date' })
  licenseExpiryDate: Date;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  nationalId: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({
    type: 'simple-enum',
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  status: DriverStatus;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  totalTrips: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'date', nullable: true })
  hiredDate: Date;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Park, (park) => park.drivers)
  @JoinColumn({ name: 'parkId' })
  park: Park;

  @Column({ nullable: true })
  parkId: string;

  @ManyToOne(() => User, (user) => user.driversCreated)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.assignedDriver)
  assignedVehicles: Vehicle[];

  @OneToMany(() => Booking, (booking) => booking.driver)
  bookings: Booking[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  get isLicenseExpired(): boolean {
    return new Date(this.licenseExpiryDate) < new Date();
  }
}