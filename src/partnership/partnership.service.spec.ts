import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipService } from './partnership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { PartnershipModule } from './partnership.module';

describe('PartnershipService', () => {
  let service: PartnershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), PartnershipModule],
      providers: [PartnershipService],
    }).compile();

    service = module.get<PartnershipService>(PartnershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
