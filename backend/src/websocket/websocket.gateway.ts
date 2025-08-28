import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedSocket extends Socket {
  user?: {
    sub: string;
    email: string;
    role: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (client.user) {
      this.connectedClients.delete(client.user.sub);
    }
  }

  @SubscribeMessage('authenticate')
  @UseGuards(JwtAuthGuard)
  handleAuthentication(
    @MessageBody() data: { token: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (client.user) {
      this.connectedClients.set(client.user.sub, client);
      client.emit('authenticated', { success: true, userId: client.user.sub });
      this.logger.log(`User authenticated: ${client.user.email}`);
    }
  }

  @SubscribeMessage('join-park')
  handleJoinPark(
    @MessageBody() data: { parkId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.join(`park-${data.parkId}`);
    this.logger.log(`Client ${client.id} joined park ${data.parkId}`);
  }

  @SubscribeMessage('leave-park')
  handleLeavePark(
    @MessageBody() data: { parkId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.leave(`park-${data.parkId}`);
    this.logger.log(`Client ${client.id} left park ${data.parkId}`);
  }

  @SubscribeMessage('join-booking')
  handleJoinBooking(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.join(`booking-${data.bookingId}`);
    this.logger.log(`Client ${client.id} joined booking ${data.bookingId}`);
  }

  @SubscribeMessage('driver-location-update')
  handleDriverLocationUpdate(
    @MessageBody() data: {
      driverId: string;
      latitude: number;
      longitude: number;
      heading?: number;
      speed?: number;
    },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    // Broadcast to all clients in the same park
    this.server.emit('driver-location-updated', {
      driverId: data.driverId,
      latitude: data.latitude,
      longitude: data.longitude,
      heading: data.heading,
      speed: data.speed,
      timestamp: new Date().toISOString(),
    });
  }

  // Public methods for emitting events from services
  emitBookingUpdate(bookingId: string, booking: any) {
    this.server.to(`booking-${bookingId}`).emit('booking-updated', booking);
    this.logger.log(`Booking update emitted for booking ${bookingId}`);
  }

  emitBookingStatusChange(bookingId: string, status: string, booking: any) {
    this.server.to(`booking-${bookingId}`).emit('booking-status-changed', {
      bookingId,
      status,
      booking,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Booking status change emitted: ${bookingId} -> ${status}`);
  }

  emitDriverStatusChange(driverId: string, status: string, parkId?: string) {
    const event = {
      driverId,
      status,
      timestamp: new Date().toISOString(),
    };
    
    this.server.emit('driver-status-changed', event);
    
    if (parkId) {
      this.server.to(`park-${parkId}`).emit('park-driver-status-changed', event);
    }
    
    this.logger.log(`Driver status change emitted: ${driverId} -> ${status}`);
  }

  emitVehicleStatusChange(vehicleId: string, status: string, parkId?: string) {
    const event = {
      vehicleId,
      status,
      timestamp: new Date().toISOString(),
    };
    
    this.server.emit('vehicle-status-changed', event);
    
    if (parkId) {
      this.server.to(`park-${parkId}`).emit('park-vehicle-status-changed', event);
    }
    
    this.logger.log(`Vehicle status change emitted: ${vehicleId} -> ${status}`);
  }

  emitNewBooking(booking: any) {
    this.server.emit('new-booking', {
      booking,
      timestamp: new Date().toISOString(),
    });
    
    if (booking.parkId) {
      this.server.to(`park-${booking.parkId}`).emit('park-new-booking', {
        booking,
        timestamp: new Date().toISOString(),
      });
    }
    
    this.logger.log(`New booking emitted: ${booking.id}`);
  }

  emitParkStatsUpdate(parkId: string, stats: any) {
    this.server.to(`park-${parkId}`).emit('park-stats-updated', {
      parkId,
      stats,
      timestamp: new Date().toISOString(),
    });
    
    this.logger.log(`Park stats update emitted for park ${parkId}`);
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    const client = this.connectedClients.get(userId);
    if (client) {
      client.emit('notification', {
        ...notification,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`Notification sent to user ${userId}`);
    }
  }

  // Broadcast system-wide notifications
  broadcastSystemNotification(notification: any) {
    this.server.emit('system-notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
    this.logger.log('System notification broadcasted');
  }
}