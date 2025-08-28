import React from 'react';
import { type LucideProps } from 'lucide-react';

interface Trend {
  value: number;
  label: string;
  isPositive: boolean;
  prefix?: string;
  suffix?: string;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
  trend?: Trend;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {trend.prefix}{trend.value}{trend.suffix}
              </span>
              <span className="text-xs text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-50">
          <Icon className="h-6 w-6 text-gray-700" />
        </div>
      </div>
    </div>
  );
};