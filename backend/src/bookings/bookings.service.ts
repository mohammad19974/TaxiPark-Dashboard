import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus, PaymentMethod } from '../database/entities/booking.entity';
import { Park } from '../database/entities/park.entity';
import { Driver } from '../database/entities/driver.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { Customer } from '../database/entities/customer.entity';
import { User } from '../database/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Park)
    private readonly parkRepository: Repository<Park>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Verify park exists
    const park = await this.parkRepository.findOne({
      where: { id: createBookingDto.parkId },
    });
    if (!park) {
      throw new NotFoundException(`Park with ID ${createBookingDto.parkId} not found`);
    }

    // Verify customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: createBookingDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${createBookingDto.customerId} not found`);
    }

    // Verify driver exists if provided
    if (createBookingDto.driverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: createBookingDto.driverId },
      });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${createBookingDto.driverId} not found`);
      }
    }

    // Verify vehicle exists if provided
    if (createBookingDto.vehicleId) {
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: createBookingDto.vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${createBookingDto.vehicleId} not found`);
      }
    }

    // Verify created by user exists if provided
    if (createBookingDto.createdById) {
      const user = await this.userRepository.findOne({
        where: { id: createBookingDto.createdById },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${createBookingDto.createdById} not found`);
      }
    }

    // Generate booking number
    const bookingNumber = await this.generateBookingNumber();

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      bookingNumber,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['park', 'driver', 'vehicle', 'customer', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['park', 'driver', 'vehicle', 'customer', 'createdBy'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // Verify entities exist if being updated
    if (updateBookingDto.parkId) {
      const park = await this.parkRepository.findOne({
        where: { id: updateBookingDto.parkId },
      });
      if (!park) {
        throw new NotFoundException(`Park with ID ${updateBookingDto.parkId} not found`);
      }
    }

    if (updateBookingDto.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateBookingDto.customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${updateBookingDto.customerId} not found`);
      }
    }

    if (updateBookingDto.driverId) {
      const driver = await this.driverRepository.findOne({
        where: { id: updateBookingDto.driverId },
      });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${updateBookingDto.driverId} not found`);
      }
    }

    if (updateBookingDto.vehicleId) {
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: updateBookingDto.vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${updateBookingDto.vehicleId} not found`);
      }
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }

  async findByPark(parkId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { parkId },
      relations: ['driver', 'vehicle', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { status },
      relations: ['park', 'driver', 'vehicle', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomer(customerId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { customerId },
      relations: ['park', 'driver', 'vehicle'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDriver(driverId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { driverId },
      relations: ['park', 'vehicle', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: {
        scheduledPickupTime: Between(startDate, endDate),
      },
      relations: ['park', 'driver', 'vehicle', 'customer'],
      order: { scheduledPickupTime: 'ASC' },
    });
  }

  async assignDriver(bookingId: string, driverId: string): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    booking.driverId = driverId;
    return await this.bookingRepository.save(booking);
  }

  async assignVehicle(bookingId: string, vehicleId: string): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    booking.vehicleId = vehicleId;
    return await this.bookingRepository.save(booking);
  }

  async updateStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    booking.status = status;

    // Set timestamps based on status
    const now = new Date();
    switch (status) {
      case BookingStatus.CONFIRMED:
        booking.confirmedAt = now;
        break;
      case BookingStatus.IN_PROGRESS:
        booking.actualPickupTime = now;
        break;
      case BookingStatus.COMPLETED:
        booking.actualDropoffTime = now;
        break;
      case BookingStatus.CANCELLED:
        booking.cancelledAt = now;
        break;
    }

    return await this.bookingRepository.save(booking);
  }

  async updatePaymentStatus(bookingId: string, paymentStatus: PaymentStatus): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    booking.paymentStatus = paymentStatus;
    return await this.bookingRepository.save(booking);
  }

  async getBookingStats(parkId?: string) {
    const whereClause = parkId ? { parkId } : {};
    
    const [total, pending, confirmed, inProgress, completed, cancelled] = await Promise.all([
      this.bookingRepository.count({ where: whereClause }),
      this.bookingRepository.count({ where: { ...whereClause, status: BookingStatus.PENDING } }),
      this.bookingRepository.count({ where: { ...whereClause, status: BookingStatus.CONFIRMED } }),
      this.bookingRepository.count({ where: { ...whereClause, status: BookingStatus.IN_PROGRESS } }),
      this.bookingRepository.count({ where: { ...whereClause, status: BookingStatus.COMPLETED } }),
      this.bookingRepository.count({ where: { ...whereClause, status: BookingStatus.CANCELLED } }),
    ]);

    const totalRevenue = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalAmount)', 'sum')
      .where(parkId ? 'booking.parkId = :parkId' : '1=1', { parkId })
      .andWhere('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getRawOne();

    return {
      total,
      pending,
      confirmed,
      inProgress,
      completed,
      cancelled,
      totalRevenue: parseFloat(totalRevenue?.sum || '0'),
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  private async generateBookingNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `BK${year}${month}${day}`;
    
    // Find the last booking number for today
    const lastBooking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.bookingNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('booking.bookingNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastBooking) {
      const lastSequence = parseInt(lastBooking.bookingNumber.slice(-4));
      sequence = lastSequence + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
  }
}