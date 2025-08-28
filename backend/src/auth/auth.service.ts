/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { EmailService } from './services/email.service';
import { OtpService } from './services/otp.service';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import {
  ForgotPasswordDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ResendOtpDto,
} from './dto/forgot-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private otpService: OtpService,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = {
      email: (user as any).email as string,
      sub: (user as any).id as string,
      role: (user as any).role as string,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any).id as string,
        email: (user as any).email as string,
        firstName: (user as any).firstName as string,
        lastName: (user as any).lastName as string,
        role: (user as any).role as string,
      },
    };
  }

  async register(createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = forgotPasswordDto;

    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message:
          'If the email exists in our system, you will receive an OTP shortly.',
      };
    }

    // Generate OTP and reset token
    const otp = this.otpService.generateOtp();
    const resetToken = this.otpService.generateResetToken();
    const hashedToken = this.otpService.hashToken(resetToken);
    const expiresAt = this.otpService.getOtpExpirationDate();

    // Save reset token to database
    const passwordResetToken = this.passwordResetTokenRepository.create({
      userId: user.id,
      token: hashedToken,
      otp,
      expiresAt,
      isUsed: false,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Send OTP email
    try {
      await this.emailService.sendOtpEmail(email, otp);
    } catch {
      // Clean up the token if email fails
      await this.passwordResetTokenRepository.delete(passwordResetToken.id);
      throw new BadRequestException('Failed to send email. Please try again.');
    }

    return {
      success: true,
      message: 'OTP sent to your email address.',
    };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ success: boolean; resetToken: string; expiresAt: string }> {
    const { email, otp } = verifyOtpDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find valid OTP token
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        userId: user.id,
        otp,
        isUsed: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid OTP');
    }

    // Check if OTP is expired
    if (this.otpService.isOtpExpired(resetToken.createdAt)) {
      await this.passwordResetTokenRepository.delete(resetToken.id);
      throw new BadRequestException('OTP has expired');
    }

    // Generate new reset token for password reset
    const newResetToken = this.otpService.generateResetToken();
    const hashedNewToken = this.otpService.hashToken(newResetToken);
    const newExpiresAt = this.otpService.getResetTokenExpirationDate();

    // Update the token
    resetToken.token = hashedNewToken;
    resetToken.expiresAt = newExpiresAt;
    await this.passwordResetTokenRepository.save(resetToken);

    return {
      success: true,
      resetToken: newResetToken,
      expiresAt: newExpiresAt.toISOString(),
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    const { resetToken, newPassword } = resetPasswordDto;

    const hashedToken = this.otpService.hashToken(resetToken);

    // Find valid reset token
    const tokenRecord = await this.passwordResetTokenRepository.findOne({
      where: {
        token: hashedToken,
        isUsed: false,
      },
      relations: ['user'],
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (this.otpService.isResetTokenExpired(tokenRecord.createdAt)) {
      await this.passwordResetTokenRepository.delete(tokenRecord.id);
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.usersService.updatePassword(tokenRecord.userId, hashedPassword);

    // Mark token as used
    tokenRecord.isUsed = true;
    await this.passwordResetTokenRepository.save(tokenRecord);

    // Clean up old tokens for this user
    await this.passwordResetTokenRepository.delete({
      userId: tokenRecord.userId,
      isUsed: true,
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  async resendOtp(
    resendOtpDto: ResendOtpDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = resendOtpDto;

    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return {
        success: true,
        message:
          'If the email exists in our system, you will receive an OTP shortly.',
      };
    }

    // Clean up old unused tokens for this user
    await this.passwordResetTokenRepository.delete({
      userId: user.id,
      isUsed: false,
    });

    // Generate new OTP and token
    const otp = this.otpService.generateOtp();
    const resetToken = this.otpService.generateResetToken();
    const hashedToken = this.otpService.hashToken(resetToken);
    const expiresAt = this.otpService.getOtpExpirationDate();

    // Save new reset token
    const passwordResetToken = this.passwordResetTokenRepository.create({
      userId: user.id,
      token: hashedToken,
      otp,
      expiresAt,
      isUsed: false,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Send OTP email
    try {
      await this.emailService.sendOtpEmail(email, otp);
    } catch {
      await this.passwordResetTokenRepository.delete(passwordResetToken.id);
      throw new BadRequestException('Failed to send email. Please try again.');
    }

    return {
      success: true,
      message: 'New OTP sent to your email address.',
    };
  }
}
