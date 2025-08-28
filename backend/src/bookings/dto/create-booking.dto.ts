import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsUUID, IsDateString, Min } from 'class-validator';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../../database/entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledPickupTime: string;

  @IsDateString()
  @IsOptional()
  scheduledDropoffTime?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedDistance?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedDuration?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedFare?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  actualDistance?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  actualDuration?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  baseFare?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  distanceFare?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  timeFare?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  additionalCharges?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  totalAmount?: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  parkId: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  createdById?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus = BookingStatus.PENDING;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus = PaymentStatus.PENDING;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  customerNotes?: string;

  @IsString()
  @IsOptional()
  driverNotes?: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}