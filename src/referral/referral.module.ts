import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralEntity } from './referral.entity';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralEntity])],
  providers: [ReferralService],
  exports: [TypeOrmModule, ReferralService],
  controllers: [ReferralController],
})
export class ReferralModule {}
