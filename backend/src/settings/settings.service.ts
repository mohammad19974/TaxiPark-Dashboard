import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Setting, SettingType } from '../database/entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { QuerySettingsDto } from './dto/query-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async create(
    createSettingDto: CreateSettingDto,
    createdById: string,
  ): Promise<Setting> {
    // Check if setting with same key already exists
    const whereCondition: any = {
      key: createSettingDto.key,
    };
    
    if (createSettingDto.parkId) {
      whereCondition.parkId = createSettingDto.parkId;
    } else {
      whereCondition.parkId = null;
    }
    
    const existingSetting = await this.settingsRepository.findOne({
      where: whereCondition,
    });

    if (existingSetting) {
      throw new ConflictException(
        `Setting with key '${createSettingDto.key}' already exists`,
      );
    }

    // Validate value based on type
    this.validateSettingValue(createSettingDto.value, createSettingDto.type);

    const setting = this.settingsRepository.create({
      ...createSettingDto,
      createdById,
    });

    return this.settingsRepository.save(setting);
  }

  async findAll(queryDto: QuerySettingsDto): Promise<Setting[]> {
    const queryBuilder = this.settingsRepository
      .createQueryBuilder('setting')
      .leftJoinAndSelect('setting.park', 'park')
      .leftJoinAndSelect('setting.createdBy', 'createdBy');

    if (queryDto.category) {
      queryBuilder.andWhere('setting.category = :category', {
        category: queryDto.category,
      });
    }

    if (queryDto.type) {
      queryBuilder.andWhere('setting.type = :type', { type: queryDto.type });
    }

    if (queryDto.isGlobal !== undefined) {
      queryBuilder.andWhere('setting.isGlobal = :isGlobal', {
        isGlobal: queryDto.isGlobal,
      });
    }

    if (queryDto.isEditable !== undefined) {
      queryBuilder.andWhere('setting.isEditable = :isEditable', {
        isEditable: queryDto.isEditable,
      });
    }

    if (queryDto.parkId) {
      queryBuilder.andWhere('setting.parkId = :parkId', {
        parkId: queryDto.parkId,
      });
    }

    if (queryDto.search) {
      queryBuilder.andWhere(
        '(setting.key LIKE :search OR setting.description LIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    return queryBuilder.orderBy('setting.category', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Setting> {
    const setting = await this.settingsRepository.findOne({
      where: { id },
      relations: ['park', 'createdBy'],
    });

    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }

    return setting;
  }

  async findByKey(key: string, parkId?: string): Promise<Setting | null> {
    const whereCondition: any = { key };
    
    if (parkId) {
      whereCondition.parkId = parkId;
    } else {
      whereCondition.parkId = null;
    }
    
    return this.settingsRepository.findOne({
      where: whereCondition,
      relations: ['park', 'createdBy'],
    });
  }

  async update(id: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(id);

    if (!setting.isEditable) {
      throw new BadRequestException('This setting is not editable');
    }

    // Validate value if provided
    if (updateSettingDto.value !== undefined) {
      this.validateSettingValue(updateSettingDto.value, setting.type);
    }

    Object.assign(setting, updateSettingDto);
    return this.settingsRepository.save(setting);
  }

  async remove(id: string): Promise<void> {
    const setting = await this.findOne(id);

    if (!setting.isEditable) {
      throw new BadRequestException('This setting cannot be deleted');
    }

    await this.settingsRepository.remove(setting);
  }

  async getSettingValue(key: string, parkId?: string): Promise<any> {
    const setting = await this.findByKey(key, parkId);
    
    if (!setting) {
      // Try to find global setting if park-specific not found
      if (parkId) {
        const globalSetting = await this.findByKey(key);
        return globalSetting?.parsedValue || null;
      }
      return null;
    }

    return setting.parsedValue;
  }

  async updateSettingValue(
    key: string,
    value: any,
    parkId?: string,
  ): Promise<Setting> {
    const setting = await this.findByKey(key, parkId);

    if (!setting) {
      throw new NotFoundException(`Setting with key '${key}' not found`);
    }

    if (!setting.isEditable) {
      throw new BadRequestException('This setting is not editable');
    }

    const stringValue = this.convertValueToString(value, setting.type);
    this.validateSettingValue(stringValue, setting.type);

    setting.value = stringValue;
    return this.settingsRepository.save(setting);
  }

  private validateSettingValue(value: string, type: SettingType): void {
    try {
      switch (type) {
        case SettingType.BOOLEAN:
          if (!['true', 'false'].includes(value.toLowerCase())) {
            throw new Error('Boolean value must be "true" or "false"');
          }
          break;
        case SettingType.NUMBER:
          if (isNaN(parseFloat(value))) {
            throw new Error('Number value must be a valid number');
          }
          break;
        case SettingType.JSON:
          JSON.parse(value);
          break;
        case SettingType.STRING:
        default:
          // String values are always valid
          break;
      }
    } catch (error) {
      throw new BadRequestException(
        `Invalid value for ${type} setting: ${error.message}`,
      );
    }
  }

  private convertValueToString(value: any, type: SettingType): string {
    switch (type) {
      case SettingType.BOOLEAN:
        return String(Boolean(value));
      case SettingType.NUMBER:
        return String(Number(value));
      case SettingType.JSON:
        return JSON.stringify(value);
      case SettingType.STRING:
      default:
        return String(value);
    }
  }
}