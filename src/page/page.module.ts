import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEntity } from './page.entity/page.entity';
import { PageService } from './page.service';
import { PageController } from './page.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageEntity])],
  providers: [PageService],
  exports: [TypeOrmModule, PageService],
  controllers: [PageController],
})
export class PageModule {}
