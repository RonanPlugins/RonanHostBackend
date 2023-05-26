import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipRequestService } from './partnership-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { PartnershipRequestModule } from './partnership-request.module';

describe('PartnershipRequestService', () => {
  let service: PartnershipRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), PartnershipRequestModule],
      providers: [PartnershipRequestService],
    }).compile();

    service = module.get<PartnershipRequestService>(PartnershipRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
