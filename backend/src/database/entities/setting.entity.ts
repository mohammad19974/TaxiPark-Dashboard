import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Park } from './park.entity';
import { User } from './user.entity';

export enum SettingType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

export enum SettingCategory {
  GENERAL = 'general',
  PRICING = 'pricing',
  OPERATIONS = 'operations',
  NOTIFICATIONS = 'notifications',
  SECURITY = 'security',
}

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({
    type: 'simple-enum',
    enum: SettingType,
    default: SettingType.STRING,
  })
  type: SettingType;

  @Column({
    type: 'simple-enum',
    enum: SettingCategory,
    default: SettingCategory.GENERAL,
  })
  category: SettingCategory;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isGlobal: boolean; // If true, applies to all parks; if false, park-specific

  @Column({ type: 'boolean', default: true })
  isEditable: boolean;

  @Column({ type: 'text', nullable: true })
  defaultValue: string;

  @Column({ type: 'text', nullable: true })
  validationRules: string; // JSON string for validation rules

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Park, (park) => park.settings, { nullable: true })
  @JoinColumn({ name: 'parkId' })
  park: Park;

  @Column({ nullable: true })
  parkId: string;

  @ManyToOne(() => User, (user) => user.settingsCreated)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  // Getters
  get parsedValue(): any {
    try {
      switch (this.type) {
        case SettingType.BOOLEAN:
          return this.value === 'true';
        case SettingType.NUMBER:
          return parseFloat(this.value);
        case SettingType.JSON:
          return JSON.parse(this.value);
        default:
          return this.value;
      }
    } catch {
      return this.value;
    }
  }

  get parsedDefaultValue(): any {
    if (!this.defaultValue) return null;
    try {
      switch (this.type) {
        case SettingType.BOOLEAN:
          return this.defaultValue === 'true';
        case SettingType.NUMBER:
          return parseFloat(this.defaultValue);
        case SettingType.JSON:
          return JSON.parse(this.defaultValue);
        default:
          return this.defaultValue;
      }
    } catch {
      return this.defaultValue;
    }
  }

  get parsedValidationRules(): any {
    if (!this.validationRules) return null;
    try {
      return JSON.parse(this.validationRules);
    } catch {
      return null;
    }
  }
}