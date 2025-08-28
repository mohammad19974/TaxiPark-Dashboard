import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Park, ParkStatus } from '../entities/park.entity';
import { Driver, DriverStatus } from '../entities/driver.entity';
import { Vehicle, VehicleStatus, VehicleType, FuelType } from '../entities/vehicle.entity';
import { Customer } from '../entities/customer.entity';
import { Booking, BookingStatus, PaymentStatus, PaymentMethod } from '../entities/booking.entity';
import { Setting, SettingType, SettingCategory } from '../entities/setting.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Park)
    private parkRepository: Repository<Park>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async seedAll() {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await this.clearData();
    
    // Seed in order of dependencies
    const users = await this.seedUsers();
    const parks = await this.seedParks();
    const drivers = await this.seedDrivers(parks, users);
    const vehicles = await this.seedVehicles(parks, drivers);
    const customers = await this.seedCustomers();
    await this.seedBookings(parks, drivers, vehicles, customers);
    await this.seedSettings(parks, users);
    
    console.log('Database seeding completed!');
  }

  private async clearData() {
    console.log('Clearing existing data...');
    await this.settingRepository.clear();
    await this.bookingRepository.clear();
    await this.vehicleRepository.clear();
    await this.driverRepository.clear();
    await this.customerRepository.clear();
    await this.parkRepository.clear();
    await this.userRepository.clear();
  }

  private async seedUsers(): Promise<User[]> {
    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        email: 'admin@taxipark.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        phone: '+256700000001',
        isActive: true,
      },
      {
        email: 'manager1@taxipark.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Manager',
        role: UserRole.MANAGER,
        phone: '+256700000002',
        isActive: true,
      },
      {
        email: 'manager2@taxipark.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: UserRole.MANAGER,
        phone: '+256700000003',
        isActive: true,
      },
    ];

    return await this.userRepository.save(users);
  }

  private async seedParks(): Promise<Park[]> {
    console.log('Seeding parks...');
    
    const parks = [
      {
        name: 'Central Taxi Park',
        location: 'Kampala Central',
        address: 'Plot 123, Central Avenue, Kampala',
        latitude: 0.3476,
        longitude: 32.5825,
        capacity: 150,
        contactPhone: '+256700100001',
        contactEmail: 'central@taxipark.com',
        operatingHours: '24/7',
        status: ParkStatus.ACTIVE,
        description: 'Main taxi park in Kampala city center',
      },
      {
        name: 'Wandegeya Taxi Park',
        location: 'Wandegeya',
        address: 'Plot 456, Wandegeya Road, Kampala',
        latitude: 0.3376,
        longitude: 32.5725,
        capacity: 100,
        contactPhone: '+256700100002',
        contactEmail: 'wandegeya@taxipark.com',
        operatingHours: '05:00 - 22:00',
        status: ParkStatus.ACTIVE,
        description: 'Taxi park serving Wandegeya and surrounding areas',
      },
      {
        name: 'Ntinda Taxi Park',
        location: 'Ntinda',
        address: 'Plot 789, Ntinda Road, Kampala',
        latitude: 0.3576,
        longitude: 32.5925,
        capacity: 80,
        contactPhone: '+256700100003',
        contactEmail: 'ntinda@taxipark.com',
        operatingHours: '05:30 - 21:30',
        status: ParkStatus.ACTIVE,
        description: 'Modern taxi park in Ntinda suburb',
      },
    ];

    return await this.parkRepository.save(parks);
  }

  private async seedDrivers(parks: Park[], users: User[]): Promise<Driver[]> {
    console.log('Seeding drivers...');
    
    const drivers = [
      {
        firstName: 'Moses',
        lastName: 'Kato',
        phone: '+256700200001',
        email: 'moses.kato@driver.com',
        licenseNumber: 'DL001234',
        licenseExpiryDate: new Date('2025-12-31'),
        nationalId: 'CM12345678901234',
        dateOfBirth: new Date('1985-03-15'),
        address: 'Kampala, Uganda',
        emergencyContactName: 'Grace Kato',
        emergencyContactPhone: '+256700200101',
        status: DriverStatus.AVAILABLE,
        rating: 4.5,
        totalTrips: 245,
        totalEarnings: 2450000,
        parkId: parks[0].id,
        userId: users[1].id,
      },
      {
        firstName: 'David',
        lastName: 'Mukasa',
        phone: '+256700200002',
        email: 'david.mukasa@driver.com',
        licenseNumber: 'DL001235',
        licenseExpiryDate: new Date('2025-11-30'),
        nationalId: 'CM12345678901235',
        dateOfBirth: new Date('1988-07-22'),
        address: 'Wandegeya, Kampala',
        emergencyContactName: 'Mary Mukasa',
        emergencyContactPhone: '+256700200102',
        status: DriverStatus.AVAILABLE,
        rating: 4.2,
        totalTrips: 189,
        totalEarnings: 1890000,
        parkId: parks[1].id,
        userId: users[2].id,
      },
      {
        firstName: 'James',
        lastName: 'Ssali',
        phone: '+256700200003',
        email: 'james.ssali@driver.com',
        licenseNumber: 'DL001236',
        licenseExpiryDate: new Date('2026-01-15'),
        nationalId: 'CM12345678901236',
        dateOfBirth: new Date('1982-11-10'),
        address: 'Ntinda, Kampala',
        emergencyContactName: 'Rose Ssali',
        emergencyContactPhone: '+256700200103',
        status: DriverStatus.ON_TRIP,
        rating: 4.8,
        totalTrips: 312,
        totalEarnings: 3120000,
        parkId: parks[2].id,
      },
      {
        firstName: 'Peter',
        lastName: 'Namugga',
        phone: '+256700200004',
        email: 'peter.namugga@driver.com',
        licenseNumber: 'DL001237',
        licenseExpiryDate: new Date('2025-09-20'),
        nationalId: 'CM12345678901237',
        dateOfBirth: new Date('1990-05-08'),
        address: 'Central Kampala',
        emergencyContactName: 'Agnes Namugga',
        emergencyContactPhone: '+256700200104',
        status: DriverStatus.AVAILABLE,
        rating: 4.1,
        totalTrips: 156,
        totalEarnings: 1560000,
        parkId: parks[0].id,
      },
      {
        firstName: 'Robert',
        lastName: 'Kiprotich',
        phone: '+256700200005',
        email: 'robert.kiprotich@driver.com',
        licenseNumber: 'DL001238',
        licenseExpiryDate: new Date('2025-08-12'),
        nationalId: 'CM12345678901238',
        dateOfBirth: new Date('1987-12-03'),
        address: 'Wandegeya, Kampala',
        emergencyContactName: 'Susan Kiprotich',
        emergencyContactPhone: '+256700200105',
        status: DriverStatus.AVAILABLE,
        rating: 4.6,
        totalTrips: 278,
        totalEarnings: 2780000,
        parkId: parks[1].id,
      },
    ];

    return await this.driverRepository.save(drivers);
  }

  private async seedVehicles(parks: Park[], drivers: Driver[]): Promise<Vehicle[]> {
    console.log('Seeding vehicles...');
    
    const vehicles = [
      {
        plateNumber: 'UAM 123A',
        make: 'Toyota',
        model: 'Hiace',
        year: 2020,
        color: 'White',
        type: VehicleType.MINIVAN,
        seatingCapacity: 14,
        fuelType: FuelType.PETROL,
        engineNumber: 'ENG001234',
        chassisNumber: 'CHS001234',
        insuranceNumber: 'INS001234',
        insuranceExpiryDate: new Date('2025-06-30'),
        roadworthinessExpiryDate: new Date('2025-12-31'),
        lastMaintenanceDate: new Date('2024-11-15'),
        nextMaintenanceDate: new Date('2025-02-15'),
        mileage: 45000,
        status: VehicleStatus.ACTIVE,
        parkId: parks[0].id,
        assignedDriverId: drivers[0].id,
        photos: JSON.stringify(['vehicle1_1.jpg', 'vehicle1_2.jpg']),
      },
      {
        plateNumber: 'UAM 456B',
        make: 'Toyota',
        model: 'Hiace',
        year: 2019,
        color: 'Blue',
        type: VehicleType.MINIVAN,
        seatingCapacity: 14,
        fuelType: FuelType.PETROL,
        engineNumber: 'ENG001235',
        chassisNumber: 'CHS001235',
        insuranceNumber: 'INS001235',
        insuranceExpiryDate: new Date('2025-05-15'),
        roadworthinessExpiryDate: new Date('2025-11-30'),
        lastMaintenanceDate: new Date('2024-10-20'),
        nextMaintenanceDate: new Date('2025-01-20'),
        mileage: 52000,
        status: VehicleStatus.ACTIVE,
        parkId: parks[1].id,
        assignedDriverId: drivers[1].id,
        photos: JSON.stringify(['vehicle2_1.jpg']),
      },
      {
        plateNumber: 'UAM 789C',
        make: 'Nissan',
        model: 'Urvan',
        year: 2021,
        color: 'Silver',
        type: VehicleType.MINIVAN,
        seatingCapacity: 15,
        fuelType: FuelType.DIESEL,
        engineNumber: 'ENG001236',
        chassisNumber: 'CHS001236',
        insuranceNumber: 'INS001236',
        insuranceExpiryDate: new Date('2025-08-20'),
        roadworthinessExpiryDate: new Date('2026-01-15'),
        lastMaintenanceDate: new Date('2024-12-01'),
        nextMaintenanceDate: new Date('2025-03-01'),
        mileage: 38000,
        status: VehicleStatus.ON_TRIP,
        parkId: parks[2].id,
        assignedDriverId: drivers[2].id,
        photos: JSON.stringify(['vehicle3_1.jpg', 'vehicle3_2.jpg', 'vehicle3_3.jpg']),
      },
      {
        plateNumber: 'UAM 012D',
        make: 'Toyota',
        model: 'Coaster',
        year: 2018,
        color: 'Yellow',
        type: VehicleType.MINIVAN,
        seatingCapacity: 25,
        fuelType: FuelType.DIESEL,
        engineNumber: 'ENG001237',
        chassisNumber: 'CHS001237',
        insuranceNumber: 'INS001237',
        insuranceExpiryDate: new Date('2025-04-10'),
        roadworthinessExpiryDate: new Date('2025-10-31'),
        lastMaintenanceDate: new Date('2024-11-05'),
        nextMaintenanceDate: new Date('2025-02-05'),
        mileage: 68000,
        status: VehicleStatus.MAINTENANCE,
        parkId: parks[0].id,
        photos: JSON.stringify(['vehicle4_1.jpg']),
      },
      {
        plateNumber: 'UAM 345E',
        make: 'Isuzu',
        model: 'NPR',
        year: 2022,
        color: 'White',
        type: VehicleType.MINIVAN,
        seatingCapacity: 18,
        fuelType: FuelType.DIESEL,
        engineNumber: 'ENG001238',
        chassisNumber: 'CHS001238',
        insuranceNumber: 'INS001238',
        insuranceExpiryDate: new Date('2025-09-30'),
        roadworthinessExpiryDate: new Date('2026-03-15'),
        lastMaintenanceDate: new Date('2024-12-10'),
        nextMaintenanceDate: new Date('2025-03-10'),
        mileage: 25000,
        status: VehicleStatus.ACTIVE,
        parkId: parks[1].id,
        assignedDriverId: drivers[4].id,
        photos: JSON.stringify(['vehicle5_1.jpg', 'vehicle5_2.jpg']),
      },
    ];

    return await this.vehicleRepository.save(vehicles);
  }

  private async seedCustomers(): Promise<Customer[]> {
    console.log('Seeding customers...');
    
    const customers = [
      {
        firstName: 'Alice',
        lastName: 'Nakato',
        phone: '+256700300001',
        email: 'alice.nakato@customer.com',
        address: 'Kololo, Kampala',
        dateOfBirth: new Date('1992-04-18'),
        preferredPaymentMethod: PaymentMethod.MOBILE_MONEY,
        totalBookings: 15,
        totalSpent: 450000,
        averageRating: 4.3,
        isActive: true,
      },
      {
        firstName: 'Brian',
        lastName: 'Okello',
        phone: '+256700300002',
        email: 'brian.okello@customer.com',
        address: 'Bugolobi, Kampala',
        dateOfBirth: new Date('1988-09-25'),
        preferredPaymentMethod: PaymentMethod.CASH,
        totalBookings: 8,
        totalSpent: 240000,
        averageRating: 4.1,
        isActive: true,
      },
      {
        firstName: 'Catherine',
        lastName: 'Auma',
        phone: '+256700300003',
        email: 'catherine.auma@customer.com',
        address: 'Muyenga, Kampala',
        dateOfBirth: new Date('1995-01-12'),
        preferredPaymentMethod: PaymentMethod.CARD,
        totalBookings: 22,
        totalSpent: 660000,
        averageRating: 4.7,
        isActive: true,
      },
      {
        firstName: 'Daniel',
        lastName: 'Wanyama',
        phone: '+256700300004',
        email: 'daniel.wanyama@customer.com',
        address: 'Nakawa, Kampala',
        dateOfBirth: new Date('1990-11-30'),
        preferredPaymentMethod: PaymentMethod.MOBILE_MONEY,
        totalBookings: 12,
        totalSpent: 360000,
        averageRating: 4.0,
        isActive: true,
      },
      {
        firstName: 'Grace',
        lastName: 'Nambi',
        phone: '+256700300005',
        email: 'grace.nambi@customer.com',
        address: 'Rubaga, Kampala',
        dateOfBirth: new Date('1993-06-08'),
        preferredPaymentMethod: PaymentMethod.BANK_TRANSFER,
        totalBookings: 18,
        totalSpent: 540000,
        averageRating: 4.5,
        isActive: true,
      },
    ];

    return await this.customerRepository.save(customers);
  }

  private async seedBookings(
    parks: Park[],
    drivers: Driver[],
    vehicles: Vehicle[],
    customers: Customer[],
  ): Promise<Booking[]> {
    console.log('Seeding bookings...');
    
    const now = new Date();
    const bookings = [
      {
        bookingNumber: 'BK001',
        pickupLocation: 'Kampala Central',
        pickupLatitude: 0.3476,
        pickupLongitude: 32.5825,
        dropoffLocation: 'Wandegeya',
        dropoffLatitude: 0.3376,
        dropoffLongitude: 32.5725,
        scheduledPickupTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        actualPickupTime: new Date(now.getTime() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // 5 min after scheduled
        actualDropoffTime: new Date(now.getTime() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        estimatedDistance: 5.2,
        actualDistance: 5.8,
        estimatedDuration: 25,
        actualDuration: 30,
        estimatedFare: 15000,
        actualFare: 15000,
        passengerCount: 1,
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        customerRating: 4.5,
        driverRating: 4.2,
        customerFeedback: 'Good service, on time',
        driverFeedback: 'Pleasant customer',
        parkId: parks[0].id,
        driverId: drivers[0].id,
        vehicleId: vehicles[0].id,
        customerId: customers[0].id,
      },
      {
        bookingNumber: 'BK002',
        pickupLocation: 'Ntinda',
        pickupLatitude: 0.3576,
        pickupLongitude: 32.5925,
        dropoffLocation: 'Central Kampala',
        dropoffLatitude: 0.3476,
        dropoffLongitude: 32.5825,
        scheduledPickupTime: new Date(now.getTime() + 30 * 60 * 1000), // 30 min from now
        estimatedDistance: 8.5,
        estimatedDuration: 35,
        estimatedFare: 25000,
        passengerCount: 2,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CASH,
        parkId: parks[2].id,
        driverId: drivers[2].id,
        vehicleId: vehicles[2].id,
        customerId: customers[1].id,
      },
      {
        bookingNumber: 'BK003',
        pickupLocation: 'Wandegeya Market',
        pickupLatitude: 0.3376,
        pickupLongitude: 32.5725,
        dropoffLocation: 'Makerere University',
        dropoffLatitude: 0.3306,
        dropoffLongitude: 32.5656,
        scheduledPickupTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
        actualPickupTime: new Date(now.getTime() - 25 * 60 * 1000), // 25 min ago
        estimatedDistance: 2.1,
        actualDistance: 2.3,
        estimatedDuration: 12,
        actualDuration: 15,
        estimatedFare: 8000,
        actualFare: 8000,
        passengerCount: 1,
        status: BookingStatus.IN_PROGRESS,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.MOBILE_MONEY,
        parkId: parks[1].id,
        driverId: drivers[1].id,
        vehicleId: vehicles[1].id,
        customerId: customers[2].id,
      },
      {
        bookingNumber: 'BK004',
        pickupLocation: 'Kololo',
        pickupLatitude: 0.3376,
        pickupLongitude: 32.5925,
        dropoffLocation: 'Entebbe Airport',
        dropoffLatitude: 0.0424,
        dropoffLongitude: 32.4435,
        scheduledPickupTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        estimatedDistance: 45.2,
        estimatedDuration: 90,
        estimatedFare: 120000,
        passengerCount: 3,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.CARD,
        specialInstructions: 'Airport pickup, need receipt',
        parkId: parks[0].id,
        customerId: customers[3].id,
      },
      {
        bookingNumber: 'BK005',
        pickupLocation: 'Rubaga Cathedral',
        pickupLatitude: 0.3076,
        pickupLongitude: 32.5525,
        dropoffLocation: 'Nakawa Market',
        dropoffLatitude: 0.3476,
        dropoffLongitude: 32.6125,
        scheduledPickupTime: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        actualPickupTime: new Date(now.getTime() - 3 * 60 * 60 * 1000 + 10 * 60 * 1000), // 10 min late
        actualDropoffTime: new Date(now.getTime() - 2.2 * 60 * 60 * 1000), // 2.2 hours ago
        estimatedDistance: 12.8,
        actualDistance: 13.5,
        estimatedDuration: 45,
        actualDuration: 48,
        estimatedFare: 35000,
        actualFare: 35000,
        passengerCount: 4,
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        customerRating: 4.0,
        driverRating: 4.3,
        customerFeedback: 'Slightly late but good driving',
        parkId: parks[1].id,
        driverId: drivers[4].id,
        vehicleId: vehicles[4].id,
        customerId: customers[4].id,
      },
    ];

    return this.bookingRepository.save(bookings);
  }

  private async seedSettings(parks: Park[], users: User[]): Promise<Setting[]> {
    console.log('Seeding settings...');

    const adminUser = users.find(user => user.role === UserRole.ADMIN);
    const firstPark = parks[0];

    const settingsData = [
      // Global settings
      {
        key: 'app_name',
        value: 'Taxi Parks Dashboard',
        type: SettingType.STRING,
        category: SettingCategory.GENERAL,
        description: 'Application name displayed in the interface',
        isGlobal: true,
        isEditable: true,
        defaultValue: 'Taxi Parks Dashboard',
        createdById: adminUser?.id,
      },
      {
        key: 'default_currency',
        value: 'USD',
        type: SettingType.STRING,
        category: SettingCategory.PRICING,
        description: 'Default currency for pricing',
        isGlobal: true,
        isEditable: true,
        defaultValue: 'USD',
        createdById: adminUser?.id,
      },
      {
        key: 'base_fare',
        value: '5.00',
        type: SettingType.NUMBER,
        category: SettingCategory.PRICING,
        description: 'Base fare for all trips',
        isGlobal: true,
        isEditable: true,
        defaultValue: '5.00',
        validationRules: JSON.stringify({ min: 0, max: 100 }),
        createdById: adminUser?.id,
      },
      {
        key: 'per_km_rate',
        value: '2.50',
        type: SettingType.NUMBER,
        category: SettingCategory.PRICING,
        description: 'Rate per kilometer',
        isGlobal: true,
        isEditable: true,
        defaultValue: '2.50',
        validationRules: JSON.stringify({ min: 0, max: 50 }),
        createdById: adminUser?.id,
      },
      {
        key: 'waiting_time_rate',
        value: '0.50',
        type: SettingType.NUMBER,
        category: SettingCategory.PRICING,
        description: 'Rate per minute for waiting time',
        isGlobal: true,
        isEditable: true,
        defaultValue: '0.50',
        validationRules: JSON.stringify({ min: 0, max: 10 }),
        createdById: adminUser?.id,
      },
      {
        key: 'max_booking_advance_days',
        value: '30',
        type: SettingType.NUMBER,
        category: SettingCategory.OPERATIONS,
        description: 'Maximum days in advance a booking can be made',
        isGlobal: true,
        isEditable: true,
        defaultValue: '30',
        validationRules: JSON.stringify({ min: 1, max: 365 }),
        createdById: adminUser?.id,
      },
      {
        key: 'enable_notifications',
        value: 'true',
        type: SettingType.BOOLEAN,
        category: SettingCategory.NOTIFICATIONS,
        description: 'Enable system notifications',
        isGlobal: true,
        isEditable: true,
        defaultValue: 'true',
        createdById: adminUser?.id,
      },
      {
        key: 'notification_channels',
        value: JSON.stringify(['email', 'sms', 'push']),
        type: SettingType.JSON,
        category: SettingCategory.NOTIFICATIONS,
        description: 'Available notification channels',
        isGlobal: true,
        isEditable: true,
        defaultValue: JSON.stringify(['email', 'sms']),
        createdById: adminUser?.id,
      },
      {
        key: 'session_timeout_minutes',
        value: '60',
        type: SettingType.NUMBER,
        category: SettingCategory.SECURITY,
        description: 'User session timeout in minutes',
        isGlobal: true,
        isEditable: true,
        defaultValue: '60',
        validationRules: JSON.stringify({ min: 5, max: 480 }),
        createdById: adminUser?.id,
      },
      {
        key: 'require_2fa',
        value: 'false',
        type: SettingType.BOOLEAN,
        category: SettingCategory.SECURITY,
        description: 'Require two-factor authentication',
        isGlobal: true,
        isEditable: true,
        defaultValue: 'false',
        createdById: adminUser?.id,
      },
      // Park-specific settings
      {
        key: 'park_commission_rate',
        value: '15.0',
        type: SettingType.NUMBER,
        category: SettingCategory.PRICING,
        description: 'Commission rate for this park (%)',
        isGlobal: false,
        isEditable: true,
        defaultValue: '15.0',
        validationRules: JSON.stringify({ min: 0, max: 50 }),
        parkId: firstPark?.id,
        createdById: adminUser?.id,
      },
      {
        key: 'park_operating_hours',
        value: JSON.stringify({
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '23:00' },
          sunday: { open: '08:00', close: '21:00' },
        }),
        type: SettingType.JSON,
        category: SettingCategory.OPERATIONS,
        description: 'Operating hours for this park',
        isGlobal: false,
        isEditable: true,
        defaultValue: JSON.stringify({
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '06:00', close: '22:00' },
          sunday: { open: '06:00', close: '22:00' },
        }),
        parkId: firstPark?.id,
        createdById: adminUser?.id,
      },
    ];

    const settings = this.settingRepository.create(settingsData);
    return this.settingRepository.save(settings);
  }
}