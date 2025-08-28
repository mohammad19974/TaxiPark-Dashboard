import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SettingType, SettingCategory } from '../../database/entities/setting.entity';

export class QuerySettingsDto {
  @IsOptional()
  @IsEnum(SettingCategory)
  category?: SettingCategory;

  @IsOptional()
  @IsEnum(SettingType)
  type?: SettingType;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isGlobal?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isEditable?: boolean;

  @IsOptional()
  @IsUUID()
  parkId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}