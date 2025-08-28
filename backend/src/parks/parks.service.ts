import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Park, ParkStatus } from '../database/entities/park.entity';
import { CreateParkDto } from './dto/create-park.dto';
import { UpdateParkDto } from './dto/update-park.dto';

@Injectable()
export class ParksService {
  constructor(
    @InjectRepository(Park)
    private readonly parkRepository: Repository<Park>,
  ) {}

  async create(createParkDto: CreateParkDto): Promise<Park> {
    const park = this.parkRepository.create(createParkDto);
    return await this.parkRepository.save(park);
  }

  async findAll(): Promise<Park[]> {
    return await this.parkRepository.find({
      relations: ['drivers', 'vehicles', 'bookings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Park> {
    const park = await this.parkRepository.findOne({
      where: { id },
      relations: ['drivers', 'vehicles', 'bookings'],
    });

    if (!park) {
      throw new NotFoundException(`Park with ID ${id} not found`);
    }

    return park;
  }

  async update(id: string, updateParkDto: UpdateParkDto): Promise<Park> {
    const park = await this.findOne(id);
    Object.assign(park, updateParkDto);
    return await this.parkRepository.save(park);
  }

  async remove(id: string): Promise<void> {
    const park = await this.findOne(id);
    await this.parkRepository.remove(park);
  }

  async findByStatus(status: ParkStatus): Promise<Park[]> {
    return await this.parkRepository.find({
      where: { status },
      relations: ['drivers', 'vehicles'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(id: string) {
    const park = await this.findOne(id);
    
    return {
      totalDrivers: park.drivers?.length || 0,
      totalVehicles: park.vehicles?.length || 0,
      totalBookings: park.bookings?.length || 0,
      activeDrivers: park.drivers?.filter(d => d.status === 'active').length || 0,
      activeVehicles: park.vehicles?.filter(v => v.status === 'active').length || 0,
    };
  }
}