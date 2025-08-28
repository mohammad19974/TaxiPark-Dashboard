import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';
import { ParkStatus } from '../../database/entities/park.entity';

export class CreateParkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  managerName: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  managerPhone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  managerEmail: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsEnum(ParkStatus)
  @IsOptional()
  status?: ParkStatus = ParkStatus.ACTIVE;

  @IsString()
  @IsOptional()
  description?: string;
}