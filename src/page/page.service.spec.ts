import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { PageModule } from './page.module';

describe('PageService', () => {
  let service: PageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), PageModule],
      providers: [PageService],
    }).compile();

    service = module.get<PageService>(PageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
