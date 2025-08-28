import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsBoolean()
  @IsOptional()
  isSent?: boolean;

  @IsDateString()
  @IsOptional()
  sentAt?: string;

  @IsDateString()
  @IsOptional()
  readAt?: string;
}