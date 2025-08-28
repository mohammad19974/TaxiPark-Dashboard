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
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { VehicleStatus, VehicleType } from '../database/entities/vehicle.entity';

@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findAll(
    @Query('status') status?: VehicleStatus,
    @Query('type') type?: VehicleType,
    @Query('parkId') parkId?: string,
  ) {
    if (parkId) {
      return this.vehiclesService.findByPark(parkId);
    }
    if (status) {
      return this.vehiclesService.findByStatus(status);
    }
    if (type) {
      return this.vehiclesService.findByType(type);
    }
    return this.vehiclesService.findAll();
  }

  @Get('park/:parkId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findByPark(@Param('parkId') parkId: string) {
    return this.vehiclesService.findByPark(parkId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getStats(@Param('id') id: string) {
    return this.vehiclesService.getVehicleStats(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Patch(':id/assign-driver/:driverId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  assignDriver(@Param('id') id: string, @Param('driverId') driverId: string) {
    return this.vehiclesService.assignDriver(id, driverId);
  }

  @Patch(':id/unassign-driver')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  unassignDriver(@Param('id') id: string) {
    return this.vehiclesService.unassignDriver(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}