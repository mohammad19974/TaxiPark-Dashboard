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
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { DriverStatus, LicenseClass } from '../database/entities/driver.entity';

@Controller('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findAll(
    @Query('status') status?: DriverStatus,
    @Query('licenseClass') licenseClass?: LicenseClass,
    @Query('parkId') parkId?: string,
  ) {
    if (parkId) {
      return this.driversService.findByPark(parkId);
    }
    if (status) {
      return this.driversService.findByStatus(status);
    }
    if (licenseClass) {
      return this.driversService.findByLicenseClass(licenseClass);
    }
    return this.driversService.findAll();
  }

  @Get('park/:parkId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findByPark(@Param('parkId') parkId: string) {
    return this.driversService.findByPark(parkId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getStats(@Param('id') id: string) {
    return this.driversService.getDriverStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}