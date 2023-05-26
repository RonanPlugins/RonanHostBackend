import { Module } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PartnershipController } from './partnership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnershipEntity } from './entities/partnership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnershipEntity])],
  controllers: [PartnershipController],
  providers: [PartnershipService],
  exports: [TypeOrmModule, PartnershipService],
})
export class PartnershipModule {}
