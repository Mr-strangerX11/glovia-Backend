import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { OtpService, EmailOtpService } from './otp.service';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, OtpService, EmailOtpService],
  exports: [VerificationService, OtpService, EmailOtpService],
})
export class VerificationModule {}
