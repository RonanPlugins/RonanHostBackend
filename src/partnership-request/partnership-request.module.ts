import { Module } from '@nestjs/common';
import { PartnershipRequestService } from './partnership-request.service';
import { PartnershipRequestController } from './partnership-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnershipRequestEntity } from './entities/partnership-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnershipRequestEntity])],
  controllers: [PartnershipRequestController],
  providers: [PartnershipRequestService],
  exports: [PartnershipRequestService, TypeOrmModule],
})
export class PartnershipRequestModule {}
