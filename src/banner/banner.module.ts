import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './banner.entity/banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  providers: [BannerService],
  exports: [TypeOrmModule, BannerService],
  controllers: [BannerController],
})
export class BannerModule {}
