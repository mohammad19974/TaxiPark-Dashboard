import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../../database/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.OPERATOR;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.ACTIVE;

  @IsString()
  @IsOptional()
  avatar?: string;
}