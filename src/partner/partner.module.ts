import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  controllers: [PartnerController],
  providers: [PartnerService],
  exports: [PartnerService, TypeOrmModule],
})
export class PartnerModule {}
