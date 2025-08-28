import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingDto } from './create-setting.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {
  @IsOptional()
  @IsString()
  value?: string;
}