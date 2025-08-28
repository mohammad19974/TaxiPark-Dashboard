import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1755897363136 implements MigrationInterface {
    name = 'InitialMigration1755897363136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" (
            "id" varchar PRIMARY KEY NOT NULL,
            "email" varchar NOT NULL,
            "password" varchar NOT NULL,
            "firstName" varchar NOT NULL,
            "lastName" varchar NOT NULL,
            "phone" varchar,
            "role" varchar CHECK( "role" IN ('admin','manager','operator') ) NOT NULL DEFAULT ('operator'),
            "status" varchar CHECK( "status" IN ('active','inactive','suspended') ) NOT NULL DEFAULT ('active'),
            "avatar" varchar,
            "lastLoginAt" datetime,
            "refreshToken" varchar,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
        )`);

        await queryRunner.query(`CREATE TABLE "parks" (
            "id" varchar PRIMARY KEY NOT NULL,
            "name" varchar NOT NULL,
            "description" text,
            "address" varchar NOT NULL,
            "latitude" decimal(10,8) NOT NULL,
            "longitude" decimal(11,8) NOT NULL,
            "phone" varchar,
            "email" varchar,
            "capacity" integer NOT NULL DEFAULT (0),
            "status" varchar CHECK( "status" IN ('active','inactive','maintenance') ) NOT NULL DEFAULT ('active'),
            "managerName" varchar,
            "managerPhone" varchar,
            "facilities" text,
            "operatingHours" text,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
        )`);

        await queryRunner.query(`CREATE TABLE "customers" (
            "id" varchar PRIMARY KEY NOT NULL,
            "firstName" varchar NOT NULL,
            "lastName" varchar NOT NULL,
            "phone" varchar NOT NULL,
            "email" varchar,
            "dateOfBirth" date,
            "status" varchar CHECK( "status" IN ('active','inactive','blocked') ) NOT NULL DEFAULT ('active'),
            "rating" decimal(3,2) NOT NULL DEFAULT (0),
            "totalTrips" integer NOT NULL DEFAULT (0),
            "totalSpent" decimal(10,2) NOT NULL DEFAULT (0),
            "preferredLocations" text,
            "notes" text,
            "lastBookingAt" datetime,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
            CONSTRAINT "UQ_88acd889fbe17d0e16cc4bc9174" UNIQUE ("phone")
        )`);

        await queryRunner.query(`CREATE TABLE "drivers" (
            "id" varchar PRIMARY KEY NOT NULL,
            "firstName" varchar NOT NULL,
            "lastName" varchar NOT NULL,
            "licenseNumber" varchar NOT NULL,
            "licenseClass" varchar CHECK( "licenseClass" IN ('A','B','C','D') ) NOT NULL DEFAULT ('B'),
            "licenseExpiryDate" date NOT NULL,
            "phone" varchar NOT NULL,
            "email" varchar,
            "dateOfBirth" date NOT NULL,
            "nationalId" varchar NOT NULL,
            "address" text,
            "emergencyContact" varchar,
            "emergencyPhone" varchar,
            "status" varchar CHECK( "status" IN ('active','inactive','suspended','on_trip','available') ) NOT NULL DEFAULT ('available'),
            "rating" decimal(3,2) NOT NULL DEFAULT (0),
            "totalTrips" integer NOT NULL DEFAULT (0),
            "totalEarnings" decimal(10,2) NOT NULL DEFAULT (0),
            "hiredDate" date,
            "profilePhoto" varchar,
            "notes" text,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
            "parkId" varchar,
            "createdById" varchar,
            CONSTRAINT "UQ_1b5c0e7e8b5c0e7e8b5c0e7e8b5" UNIQUE ("licenseNumber"),
            CONSTRAINT "FK_drivers_park" FOREIGN KEY ("parkId") REFERENCES "parks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_drivers_createdBy" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);

        await queryRunner.query(`CREATE TABLE "vehicles" (
            "id" varchar PRIMARY KEY NOT NULL,
            "plateNumber" varchar NOT NULL,
            "make" varchar NOT NULL,
            "model" varchar NOT NULL,
            "year" integer NOT NULL,
            "color" varchar NOT NULL,
            "type" varchar CHECK( "type" IN ('sedan','suv','hatchback','minivan','pickup') ) NOT NULL DEFAULT ('sedan'),
            "fuelType" varchar CHECK( "fuelType" IN ('petrol','diesel','hybrid','electric') ) NOT NULL DEFAULT ('petrol'),
            "seatingCapacity" integer NOT NULL,
            "engineNumber" varchar,
            "chassisNumber" varchar,
            "registrationDate" date,
            "insuranceExpiryDate" date,
            "roadworthinessExpiryDate" date,
            "mileage" integer NOT NULL DEFAULT (0),
            "status" varchar CHECK( "status" IN ('active','inactive','maintenance','out_of_service','on_trip') ) NOT NULL DEFAULT ('active'),
            "totalEarnings" decimal(10,2) NOT NULL DEFAULT (0),
            "totalTrips" integer NOT NULL DEFAULT (0),
            "lastMaintenanceDate" date,
            "nextMaintenanceDate" date,
            "notes" text,
            "photos" text,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
            "parkId" varchar,
            "assignedDriverId" varchar,
            CONSTRAINT "UQ_vehicles_plateNumber" UNIQUE ("plateNumber"),
            CONSTRAINT "FK_vehicles_park" FOREIGN KEY ("parkId") REFERENCES "parks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_vehicles_assignedDriver" FOREIGN KEY ("assignedDriverId") REFERENCES "drivers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);

        await queryRunner.query(`CREATE TABLE "bookings" (
            "id" varchar PRIMARY KEY NOT NULL,
            "bookingNumber" varchar NOT NULL,
            "pickupLocation" varchar NOT NULL,
            "pickupLatitude" decimal(10,8),
            "pickupLongitude" decimal(11,8),
            "dropoffLocation" varchar NOT NULL,
            "dropoffLatitude" decimal(10,8),
            "dropoffLongitude" decimal(11,8),
            "scheduledPickupTime" datetime NOT NULL,
            "actualPickupTime" datetime,
            "actualDropoffTime" datetime,
            "estimatedDistance" decimal(8,2),
            "actualDistance" decimal(8,2),
            "estimatedDuration" integer,
            "actualDuration" integer,
            "estimatedFare" decimal(10,2) NOT NULL,
            "actualFare" decimal(10,2),
            "passengerCount" integer NOT NULL DEFAULT (1),
            "status" varchar CHECK( "status" IN ('pending','confirmed','in_progress','completed','cancelled','no_show') ) NOT NULL DEFAULT ('pending'),
            "paymentStatus" varchar CHECK( "paymentStatus" IN ('pending','paid','partial','refunded') ) NOT NULL DEFAULT ('pending'),
            "paymentMethod" varchar CHECK( "paymentMethod" IN ('cash','card','mobile_money','bank_transfer') ),
            "specialInstructions" text,
            "notes" text,
            "customerRating" decimal(3,2),
            "driverRating" decimal(3,2),
            "customerFeedback" text,
            "driverFeedback" text,
            "cancellationReason" text,
            "cancelledAt" datetime,
            "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
            "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
            "parkId" varchar NOT NULL,
            "driverId" varchar,
            "vehicleId" varchar,
            "customerId" varchar NOT NULL,
            "createdById" varchar,
            CONSTRAINT "UQ_bookings_bookingNumber" UNIQUE ("bookingNumber"),
            CONSTRAINT "FK_bookings_park" FOREIGN KEY ("parkId") REFERENCES "parks" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_bookings_driver" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_bookings_vehicle" FOREIGN KEY ("vehicleId") REFERENCES "vehicles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_bookings_customer" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_bookings_createdBy" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);

        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_drivers_status" ON "drivers" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_drivers_park" ON "drivers" ("parkId")`);
        await queryRunner.query(`CREATE INDEX "IDX_vehicles_status" ON "vehicles" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_vehicles_park" ON "vehicles" ("parkId")`);
        await queryRunner.query(`CREATE INDEX "IDX_vehicles_assignedDriver" ON "vehicles" ("assignedDriverId")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_park" ON "bookings" ("parkId")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_driver" ON "bookings" ("driverId")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_customer" ON "bookings" ("customerId")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_scheduledPickupTime" ON "bookings" ("scheduledPickupTime")`);
        await queryRunner.query(`CREATE INDEX "IDX_customers_phone" ON "customers" ("phone")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_customers_phone"`);
        await queryRunner.query(`DROP INDEX "IDX_bookings_scheduledPickupTime"`);
        await queryRunner.query(`DROP INDEX "IDX_bookings_customer"`);
        await queryRunner.query(`DROP INDEX "IDX_bookings_driver"`);
        await queryRunner.query(`DROP INDEX "IDX_bookings_park"`);
        await queryRunner.query(`DROP INDEX "IDX_bookings_status"`);
        await queryRunner.query(`DROP INDEX "IDX_vehicles_assignedDriver"`);
        await queryRunner.query(`DROP INDEX "IDX_vehicles_park"`);
        await queryRunner.query(`DROP INDEX "IDX_vehicles_status"`);
        await queryRunner.query(`DROP INDEX "IDX_drivers_park"`);
        await queryRunner.query(`DROP INDEX "IDX_drivers_status"`);
        await queryRunner.query(`DROP INDEX "IDX_users_email"`);
        
        // Drop tables in reverse order (respecting foreign key constraints)
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "parks"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
