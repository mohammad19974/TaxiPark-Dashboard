import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Park } from '../database/entities/park.entity';
import { ParksController } from './parks.controller';
import { ParksService } from './parks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Park])],
  controllers: [ParksController],
  providers: [ParksService],
  exports: [ParksService],
})
export class ParksModule {}