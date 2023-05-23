import { Test, TestingModule } from '@nestjs/testing';
import { ReferralController } from './referral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { ReferralModule } from './referral.module';

describe('ReferralController', () => {
  let controller: ReferralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), ReferralModule],
      controllers: [ReferralController],
    }).compile();

    controller = module.get<ReferralController>(ReferralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
