import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverStatus, LicenseClass } from '../database/entities/driver.entity';
import { Park } from '../database/entities/park.entity';
import { User } from '../database/entities/user.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Park)
    private readonly parkRepository: Repository<Park>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    // Verify park exists
    const park = await this.parkRepository.findOne({
      where: { id: createDriverDto.parkId },
    });
    if (!park) {
      throw new NotFoundException(`Park with ID ${createDriverDto.parkId} not found`);
    }

    // Verify user exists if provided
    if (createDriverDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: createDriverDto.userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${createDriverDto.userId} not found`);
      }
    }

    // Check for duplicate license number
    const existingDriver = await this.driverRepository.findOne({
      where: { licenseNumber: createDriverDto.licenseNumber },
    });
    if (existingDriver) {
      throw new BadRequestException('Driver with this license number already exists');
    }

    const driver = this.driverRepository.create(createDriverDto);
    return await this.driverRepository.save(driver);
  }

  async findAll(): Promise<Driver[]> {
    try {
      return await this.driverRepository.find({
        relations: ['park', 'createdBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw new BadRequestException('Failed to fetch drivers');
    }
  }

  async findOne(id: string): Promise<Driver> {
    try {
      const driver = await this.driverRepository.findOne({
        where: { id },
        relations: ['park', 'createdBy'],
      });

      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }

      return driver;
    } catch (error) {
      console.error('Error fetching driver:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch driver details');
    }
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findOne(id);

    // Verify park exists if being updated
    if (updateDriverDto.parkId) {
      const park = await this.parkRepository.findOne({
        where: { id: updateDriverDto.parkId },
      });
      if (!park) {
        throw new NotFoundException(`Park with ID ${updateDriverDto.parkId} not found`);
      }
    }

    // Verify user exists if being updated
    if (updateDriverDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateDriverDto.userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${updateDriverDto.userId} not found`);
      }
    }

    // Check for duplicate license number if being updated
    if (updateDriverDto.licenseNumber && updateDriverDto.licenseNumber !== driver.licenseNumber) {
      const existingDriver = await this.driverRepository.findOne({
        where: { licenseNumber: updateDriverDto.licenseNumber },
      });
      if (existingDriver) {
        throw new BadRequestException('Driver with this license number already exists');
      }
    }

    Object.assign(driver, updateDriverDto);
    return await this.driverRepository.save(driver);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findOne(id);
    await this.driverRepository.remove(driver);
  }

  async findByPark(parkId: string): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { parkId },
      relations: ['createdBy', 'assignedVehicles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: DriverStatus): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { status },
      relations: ['park', 'createdBy', 'assignedVehicles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByLicenseClass(licenseClass: LicenseClass): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { licenseClass },
      relations: ['park', 'createdBy', 'assignedVehicles'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDriverStats(id: string) {
    try {
      const driver = await this.findOne(id);
      
      // For now, return basic stats without bookings relation
      // TODO: Implement proper booking stats query
      return {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        completionRate: 0,
        hasVehicle: false,
        driverInfo: {
          name: driver.firstName + ' ' + driver.lastName,
          status: driver.status,
          licenseNumber: driver.licenseNumber,
        }
      };
    } catch (error) {
      console.error('Error fetching driver stats:', error);
      throw new BadRequestException('Failed to fetch driver statistics');
    }
  }
}