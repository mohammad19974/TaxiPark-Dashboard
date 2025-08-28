import React from 'react';
import { Clock, MapPin, User } from 'lucide-react';
import * as Types from '../../types';
type BookingStatus = Types.BookingStatus;

// Mock data for recent bookings
const mockBookings = [
  {
    id: '1',
    customerName: 'John Doe',
    pickup: 'Downtown Mall',
    dropoff: 'Airport',
    time: '2 min ago',
    status: Types.BookingStatus.IN_PROGRESS,
    fare: 45.50,
  },
  {
    id: '2',
    customerName: 'Sarah Wilson',
    pickup: 'Central Station',
    dropoff: 'Business District',
    time: '5 min ago',
    status: Types.BookingStatus.COMPLETED,
    fare: 28.75,
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    pickup: 'Hotel Plaza',
    dropoff: 'Shopping Center',
    time: '8 min ago',
    status: Types.BookingStatus.ASSIGNED,
    fare: 22.00,
  },
  {
    id: '4',
    customerName: 'Emily Brown',
    pickup: 'University',
    dropoff: 'City Center',
    time: '12 min ago',
    status: Types.BookingStatus.PENDING,
    fare: 18.25,
  },
  {
    id: '5',
    customerName: 'David Lee',
    pickup: 'Residential Area',
    dropoff: 'Medical Center',
    time: '15 min ago',
    status: Types.BookingStatus.COMPLETED,
    fare: 35.80,
  },
];

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case Types.BookingStatus.COMPLETED:
      return 'badge-success';
    case Types.BookingStatus.IN_PROGRESS:
      return 'badge-warning';
    case Types.BookingStatus.ASSIGNED:
      return 'badge-secondary';
    case Types.BookingStatus.PENDING:
      return 'badge-danger';
    default:
      return 'badge-secondary';
  }
};

const getStatusText = (status: BookingStatus) => {
  switch (status) {
    case Types.BookingStatus.COMPLETED:
      return 'Completed';
    case Types.BookingStatus.IN_PROGRESS:
      return 'In Progress';
    case Types.BookingStatus.ASSIGNED:
      return 'Assigned';
    case Types.BookingStatus.PENDING:
      return 'Pending';
    default:
      return status;
  }
};

export const RecentBookings: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockBookings.map((booking) => (
        <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {booking.customerName}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {booking.time}
                </div>
              </div>
            </div>
            <span className={`badge ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>
          
          <div className="space-y-2 ml-11">
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="h-3 w-3 mr-1 text-success-500" />
              <span className="truncate">{booking.pickup}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="h-3 w-3 mr-1 text-danger-500" />
              <span className="truncate">{booking.dropoff}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 ml-11">
            <span className="text-sm font-medium text-gray-900">
              ${booking.fare.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all bookings →
        </button>
      </div>
    </div>
  );
};