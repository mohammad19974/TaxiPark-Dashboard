// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DISPATCHER = 'dispatcher',
  DRIVER = 'driver'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Driver Types
export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  currentVehicleId?: string;
  phone: string;
  address: string;
  emergencyContact: string;
  joinedAt: string;
  lastActiveAt: string;
  documents: DriverDocument[];
}

export enum DriverStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ON_TRIP = 'on_trip',
  OFFLINE = 'offline'
}

export interface DriverDocument {
  id: string;
  type: DocumentType;
  url: string;
  expiryDate?: string;
  status: DocumentStatus;
  uploadedAt: string;
}

export enum DocumentType {
  LICENSE = 'license',
  INSURANCE = 'insurance',
  REGISTRATION = 'registration',
  MEDICAL = 'medical',
  BACKGROUND_CHECK = 'background_check'
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

// Vehicle Types
export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  type: VehicleType;
  status: VehicleStatus;
  currentDriverId?: string;
  capacity: number;
  fuelType: FuelType;
  mileage: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  MINIVAN = 'minivan',
  LUXURY = 'luxury'
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
}

// Booking Types
export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  vehicleId?: string;
  status: BookingStatus;
  type: BookingType;
  pickupLocation: Location;
  dropoffLocation: Location;
  scheduledTime: string;
  actualPickupTime?: string;
  actualDropoffTime?: string;
  estimatedFare: number;
  actualFare?: number;
  distance?: number;
  duration?: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum BookingType {
  IMMEDIATE = 'immediate',
  SCHEDULED = 'scheduled',
  RECURRING = 'recurring'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  DIGITAL_WALLET = 'digital_wallet',
  BANK_TRANSFER = 'bank_transfer'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Customer Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalBookings: number;
  totalSpent: number;
  rating: number;
  preferredPaymentMethod: PaymentMethod;
  addresses: CustomerAddress[];
  createdAt: string;
  lastBookingAt?: string;
}

export interface CustomerAddress {
  id: string;
  label: string;
  address: string;
  location: Location;
  isDefault: boolean;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

// Analytics Types
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeDrivers: number;
  availableVehicles: number;
  completionRate: number;
  averageRating: number;
  todayBookings: number;
  todayRevenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface DriverPerformance {
  driverId: string;
  driverName: string;
  totalTrips: number;
  totalRevenue: number;
  rating: number;
  completionRate: number;
}

export interface VehicleUtilization {
  vehicleId: string;
  plateNumber: string;
  utilizationRate: number;
  totalTrips: number;
  revenue: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface DriverForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  address: string;
  emergencyContact: string;
}

export interface VehicleForm {
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  type: VehicleType;
  capacity: number;
  fuelType: FuelType;
  insuranceExpiry: string;
  registrationExpiry: string;
}

export interface BookingForm {
  customerId: string;
  type: BookingType;
  pickupLocation: Location;
  dropoffLocation: Location;
  scheduledTime: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Filter and Search Types
export interface DriverFilters {
  status?: DriverStatus[];
  rating?: number;
  search?: string;
  sortBy?: 'name' | 'rating' | 'totalTrips' | 'joinedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface VehicleFilters {
  status?: VehicleStatus[];
  type?: VehicleType[];
  fuelType?: FuelType[];
  search?: string;
  sortBy?: 'plateNumber' | 'make' | 'year' | 'mileage';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingFilters {
  status?: BookingStatus[];
  type?: BookingType[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: 'createdAt' | 'scheduledTime' | 'actualFare';
  sortOrder?: 'asc' | 'desc';
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export enum NotificationType {
  BOOKING_CREATED = 'booking_created',
  BOOKING_CANCELLED = 'booking_cancelled',
  DRIVER_ASSIGNED = 'driver_assigned',
  TRIP_COMPLETED = 'trip_completed',
  PAYMENT_RECEIVED = 'payment_received',
  MAINTENANCE_DUE = 'maintenance_due',
  DOCUMENT_EXPIRING = 'document_expiring',
  SYSTEM_ALERT = 'system_alert'
}