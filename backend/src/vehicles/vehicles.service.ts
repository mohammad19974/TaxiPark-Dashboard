import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus, VehicleType, FuelType } from '../database/entities/vehicle.entity';
import { Park } from '../database/entities/park.entity';
import { Driver } from '../database/entities/driver.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Park)
    private readonly parkRepository: Repository<Park>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Verify park exists
    const park = await this.parkRepository.findOne({
      where: { id: createVehicleDto.parkId },
    });
    if (!park) {
      throw new NotFoundException(`Park with ID ${createVehicleDto.parkId} not found`);
    }

    // Verify assigned driver exists if provided
    if (createVehicleDto.assignedDriverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: createVehicleDto.assignedDriverId },
      });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${createVehicleDto.assignedDriverId} not found`);
      }
    }

    // Check for duplicate plate number
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plateNumber: createVehicleDto.plateNumber },
    });
    if (existingVehicle) {
      throw new BadRequestException('Vehicle with this plate number already exists');
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      relations: ['park', 'assignedDriver', 'bookings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['park', 'assignedDriver', 'bookings'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // Verify park exists if being updated
    if (updateVehicleDto.parkId) {
      const park = await this.parkRepository.findOne({
        where: { id: updateVehicleDto.parkId },
      });
      if (!park) {
        throw new NotFoundException(`Park with ID ${updateVehicleDto.parkId} not found`);
      }
    }

    // Verify assigned driver exists if being updated
    if (updateVehicleDto.assignedDriverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: updateVehicleDto.assignedDriverId },
      });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${updateVehicleDto.assignedDriverId} not found`);
      }
    }

    // Check for duplicate plate number if being updated
    if (updateVehicleDto.plateNumber && updateVehicleDto.plateNumber !== vehicle.plateNumber) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: { plateNumber: updateVehicleDto.plateNumber },
      });
      if (existingVehicle) {
        throw new BadRequestException('Vehicle with this plate number already exists');
      }
    }

    Object.assign(vehicle, updateVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }

  async findByPark(parkId: string): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      where: { parkId },
      relations: ['assignedDriver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: VehicleStatus): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      where: { status },
      relations: ['park', 'assignedDriver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: VehicleType): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      where: { type },
      relations: ['park', 'assignedDriver'],
      order: { createdAt: 'DESC' },
    });
  }

  async assignDriver(vehicleId: string, driverId: string): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    vehicle.assignedDriverId = driverId;
    return await this.vehicleRepository.save(vehicle);
  }

  async unassignDriver(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);
    vehicle.assignedDriverId = null;
    return await this.vehicleRepository.save(vehicle);
  }

  async getVehicleStats(id: string) {
    const vehicle = await this.findOne(id);
    
    const totalBookings = vehicle.bookings?.length || 0;
    const completedBookings = vehicle.bookings?.filter(b => b.status === 'completed').length || 0;
    const totalRevenue = vehicle.bookings?.reduce((sum, booking) => sum + (booking.actualFare || 0), 0) || 0;
    const totalDistance = vehicle.bookings?.reduce((sum, booking) => sum + (booking.actualDistance || 0), 0) || 0;

    return {
      totalBookings,
      completedBookings,
      totalRevenue,
      totalDistance,
      utilizationRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      hasDriver: !!vehicle.assignedDriver,
      currentMileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      vehicleType: vehicle.type,
    };
  }
}