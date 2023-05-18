import { Test, TestingModule } from '@nestjs/testing';
import { BannerService } from './banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { BannerModule } from './banner.module';

describe('BannerService', () => {
  let service: BannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), BannerModule],
      providers: [BannerService],
    }).compile();

    service = module.get<BannerService>(BannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
