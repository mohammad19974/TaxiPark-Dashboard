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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { BookingStatus, PaymentStatus } from '../database/entities/booking.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findAll(
    @Query('status') status?: BookingStatus,
    @Query('parkId') parkId?: string,
    @Query('customerId') customerId?: string,
    @Query('driverId') driverId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.bookingsService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    if (parkId) {
      return this.bookingsService.findByPark(parkId);
    }
    if (customerId) {
      return this.bookingsService.findByCustomer(customerId);
    }
    if (driverId) {
      return this.bookingsService.findByDriver(driverId);
    }
    if (status) {
      return this.bookingsService.findByStatus(status);
    }
    return this.bookingsService.findAll();
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  getStats(@Query('parkId') parkId?: string) {
    return this.bookingsService.getBookingStats(parkId);
  }

  @Get('park/:parkId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findByPark(@Param('parkId') parkId: string) {
    return this.bookingsService.findByPark(parkId);
  }

  @Get('customer/:customerId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findByCustomer(@Param('customerId') customerId: string) {
    return this.bookingsService.findByCustomer(customerId);
  }

  @Get('driver/:driverId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findByDriver(@Param('driverId') driverId: string) {
    return this.bookingsService.findByDriver(driverId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/assign-driver/:driverId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  assignDriver(@Param('id') id: string, @Param('driverId') driverId: string) {
    return this.bookingsService.assignDriver(id, driverId);
  }

  @Patch(':id/assign-vehicle/:vehicleId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  assignVehicle(@Param('id') id: string, @Param('vehicleId') vehicleId: string) {
    return this.bookingsService.assignVehicle(id, vehicleId);
  }

  @Patch(':id/status/:status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  updateStatus(@Param('id') id: string, @Param('status') status: BookingStatus) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Patch(':id/payment-status/:paymentStatus')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  updatePaymentStatus(@Param('id') id: string, @Param('paymentStatus') paymentStatus: PaymentStatus) {
    return this.bookingsService.updatePaymentStatus(id, paymentStatus);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}