import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { SettingType, SettingCategory } from '../../database/entities/setting.entity';

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsEnum(SettingType)
  type: SettingType;

  @IsEnum(SettingCategory)
  category: SettingCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;

  @IsOptional()
  @IsBoolean()
  isEditable?: boolean;

  @IsOptional()
  @IsString()
  defaultValue?: string;

  @IsOptional()
  @IsString()
  validationRules?: string;

  @IsOptional()
  @IsUUID()
  parkId?: string;
}