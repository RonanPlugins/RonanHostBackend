import { Test, TestingModule } from '@nestjs/testing';
import { ReferralService } from './referral.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { ReferralModule } from './referral.module';

describe('referralService', () => {
  let service: ReferralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), ReferralModule],
      providers: [ReferralService],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
