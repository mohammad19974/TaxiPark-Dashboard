import { SettingsService } from '../api/generated';
import type { CreateSettingDto, UpdateSettingDto } from '../api/generated';

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: 'general' | 'pricing' | 'operations' | 'notifications' | 'security';
  description?: string;
  isGlobal: boolean;
  isEditable: boolean;
  defaultValue?: string;
  validationRules?: string;
  parkId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingsResponse {
  settings: Setting[];
  total: number;
}

export interface SettingValueResponse {
  key: string;
  value: any;
}

class SettingsServiceWrapper {
  async getAllSettings(): Promise<Setting[]> {
    try {
      const response = await SettingsService.settingsControllerFindAll();
      return response as Setting[];
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  async getSettingValue(key: string, parkId?: string): Promise<any> {
    try {
      const response = await SettingsService.settingsControllerGetSettingValue(
        key,
        parkId || ''
      );
      return (response as SettingValueResponse).value;
    } catch (error) {
      console.error(`Error fetching setting value for key ${key}:`, error);
      throw error;
    }
  }

  async updateSettingValue(key: string, value: any, parkId?: string): Promise<Setting> {
    try {
      // Use direct API call since the generated service doesn't include value parameter
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/settings/value/${key}${parkId ? `?parkId=${parkId}` : ''}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        credentials: 'include',
        body: JSON.stringify({ value }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating setting value for key ${key}:`, error);
      throw error;
    }
  }

  async createSetting(setting: CreateSettingDto): Promise<Setting> {
    try {
      const response = await SettingsService.settingsControllerCreate(setting);
      return response as Setting;
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error;
    }
  }

  async updateSetting(id: string, setting: UpdateSettingDto): Promise<Setting> {
    try {
      const response = await SettingsService.settingsControllerUpdate(id, setting);
      return response as Setting;
    } catch (error) {
      console.error(`Error updating setting ${id}:`, error);
      throw error;
    }
  }

  async deleteSetting(id: string): Promise<void> {
    try {
      await SettingsService.settingsControllerRemove(id);
    } catch (error) {
      console.error(`Error deleting setting ${id}:`, error);
      throw error;
    }
  }

  async getSetting(id: string): Promise<Setting> {
    try {
      const response = await SettingsService.settingsControllerFindOne(id);
      return response as Setting;
    } catch (error) {
      console.error(`Error fetching setting ${id}:`, error);
      throw error;
    }
  }

  // Helper methods for common settings
  async getParkSettings(parkId?: string): Promise<{
    name: string;
    address: string;
    phone: string;
    email: string;
    timezone: string;
    currency: string;
    language: string;
    operatingHours: { start: string; end: string };
  }> {
    try {
      const [name, address, phone, email, timezone, currency, language, operatingHours] = await Promise.all([
        this.getSettingValue('park_name', parkId).catch(() => 'Default Park'),
        this.getSettingValue('park_address', parkId).catch(() => ''),
        this.getSettingValue('park_phone', parkId).catch(() => ''),
        this.getSettingValue('park_email', parkId).catch(() => ''),
        this.getSettingValue('park_timezone', parkId).catch(() => 'UTC'),
        this.getSettingValue('default_currency', parkId).catch(() => 'USD'),
        this.getSettingValue('park_language', parkId).catch(() => 'en'),
        this.getSettingValue('park_operating_hours', parkId).catch(() => ({ start: '06:00', end: '22:00' }))
      ]);

      return {
        name,
        address,
        phone,
        email,
        timezone,
        currency,
        language,
        operatingHours: typeof operatingHours === 'string' ? JSON.parse(operatingHours) : operatingHours
      };
    } catch (error) {
      console.error('Error fetching park settings:', error);
      throw error;
    }
  }

  async getNotificationSettings(): Promise<{
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingAlerts: boolean;
    driverAlerts: boolean;
    maintenanceAlerts: boolean;
    revenueReports: boolean;
  }> {
    try {
      const [enableNotifications, channels] = await Promise.all([
        this.getSettingValue('enable_notifications').catch(() => true),
        this.getSettingValue('notification_channels').catch(() => ['email'])
      ]);

      const notificationChannels = typeof channels === 'string' ? JSON.parse(channels) : channels;

      return {
        emailNotifications: enableNotifications && notificationChannels.includes('email'),
        smsNotifications: enableNotifications && notificationChannels.includes('sms'),
        pushNotifications: enableNotifications && notificationChannels.includes('push'),
        bookingAlerts: enableNotifications,
        driverAlerts: enableNotifications,
        maintenanceAlerts: enableNotifications,
        revenueReports: enableNotifications
      };
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  async getPricingSettings(): Promise<{
    baseFare: number;
    perKmRate: number;
    perMinuteRate: number;
    minimumFare: number;
    cancellationFee: number;
    waitingTimeRate: number;
    nightSurcharge: number;
    peakHourSurcharge: number;
    currency: string;
  }> {
    try {
      const [baseFare, perKmRate, perMinuteRate, minimumFare, cancellationFee, waitingTimeRate, nightSurcharge, peakHourSurcharge, currency] = await Promise.all([
        this.getSettingValue('base_fare').catch(() => '5.00'),
        this.getSettingValue('per_km_rate').catch(() => '2.50'),
        this.getSettingValue('per_minute_rate').catch(() => '0.35'),
        this.getSettingValue('minimum_fare').catch(() => '5.00'),
        this.getSettingValue('cancellation_fee').catch(() => '2.50'),
        this.getSettingValue('waiting_time_rate').catch(() => '0.50'),
        this.getSettingValue('night_surcharge').catch(() => '25'),
        this.getSettingValue('peak_hour_surcharge').catch(() => '50'),
        this.getSettingValue('default_currency').catch(() => 'USD')
      ]);

      return {
        baseFare: parseFloat(baseFare),
        perKmRate: parseFloat(perKmRate),
        perMinuteRate: parseFloat(perMinuteRate),
        minimumFare: parseFloat(minimumFare),
        cancellationFee: parseFloat(cancellationFee),
        waitingTimeRate: parseFloat(waitingTimeRate),
        nightSurcharge: parseFloat(nightSurcharge),
        peakHourSurcharge: parseFloat(peakHourSurcharge),
        currency
      };
    } catch (error) {
      console.error('Error fetching pricing settings:', error);
      throw error;
    }
  }

  // Bulk update multiple settings
  async updateMultipleSettings(updates: Record<string, string | number | boolean>): Promise<void> {
    const promises = Object.entries(updates).map(([key, value]) => 
      this.updateSettingValue(key, value.toString())
    );
    await Promise.all(promises);
  }
}

export const settingsService = new SettingsServiceWrapper();