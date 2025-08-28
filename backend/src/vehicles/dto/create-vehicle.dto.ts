import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { VehicleStatus, VehicleType, FuelType } from '../../database/entities/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1900)
  year: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  type: VehicleType;

  @IsEnum(FuelType)
  @IsNotEmpty()
  fuelType: FuelType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  capacity: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  mileage?: number = 0;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  parkId: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  assignedDriverId?: string;

  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus = VehicleStatus.ACTIVE;

  @IsString()
  @IsOptional()
  insuranceNumber?: string;

  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @IsString()
  @IsOptional()
  insuranceExpiryDate?: string;

  @IsString()
  @IsOptional()
  registrationExpiryDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}