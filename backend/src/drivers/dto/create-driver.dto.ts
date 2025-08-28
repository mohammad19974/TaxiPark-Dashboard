import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsPhoneNumber, IsDateString, IsUUID } from 'class-validator';
import { DriverStatus, LicenseClass } from '../../database/entities/driver.entity';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsEnum(LicenseClass)
  @IsNotEmpty()
  licenseClass: LicenseClass;

  @IsDateString()
  @IsNotEmpty()
  licenseExpiryDate: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  parkId: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus = DriverStatus.ACTIVE;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}