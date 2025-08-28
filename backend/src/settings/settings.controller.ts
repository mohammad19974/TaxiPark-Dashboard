import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { QuerySettingsDto } from './dto/query-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createSettingDto: CreateSettingDto, @Request() req) {
    return this.settingsService.create(createSettingDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: QuerySettingsDto) {
    return this.settingsService.findAll(queryDto);
  }

  @Get('value/:key')
  async getSettingValue(
    @Param('key') key: string,
    @Query('parkId') parkId?: string,
  ) {
    const value = await this.settingsService.getSettingValue(key, parkId);
    return { key, value };
  }

  @Patch('value/:key')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async updateSettingValue(
    @Param('key') key: string,
    @Body('value') value: any,
    @Query('parkId') parkId?: string,
  ) {
    const setting = await this.settingsService.updateSettingValue(
      key,
      value,
      parkId,
    );
    return {
      key: setting.key,
      value: setting.parsedValue,
      updatedAt: setting.updatedAt,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.settingsService.remove(id);
  }
}