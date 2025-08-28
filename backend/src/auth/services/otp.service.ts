import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  /**
   * Generate a cryptographically secure 6-digit OTP
   */
  generateOtp(): string {
    // Generate a random number between 100000 and 999999
    const min = 100000;
    const max = 999999;
    
    // Use crypto.randomInt for cryptographically secure random number generation
    const otp = crypto.randomInt(min, max + 1);
    
    return otp.toString();
  }

  /**
   * Generate a secure reset token
   */
  generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash a token for secure storage
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify if a token matches its hash
   */
  verifyToken(token: string, hash: string): boolean {
    const tokenHash = this.hashToken(token);
    return crypto.timingSafeEqual(Buffer.from(tokenHash), Buffer.from(hash));
  }

  /**
   * Check if OTP has expired (5 minutes)
   */
  isOtpExpired(createdAt: Date): boolean {
    const now = new Date();
    const expirationTime = new Date(createdAt.getTime() + 5 * 60 * 1000); // 5 minutes
    return now > expirationTime;
  }

  /**
   * Check if reset token has expired (1 hour)
   */
  isResetTokenExpired(createdAt: Date): boolean {
    const now = new Date();
    const expirationTime = new Date(createdAt.getTime() + 60 * 60 * 1000); // 1 hour
    return now > expirationTime;
  }

  /**
   * Get OTP expiration date (5 minutes from now)
   */
  getOtpExpirationDate(): Date {
    return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Get reset token expiration date (1 hour from now)
   */
  getResetTokenExpirationDate(): Date {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  }
}