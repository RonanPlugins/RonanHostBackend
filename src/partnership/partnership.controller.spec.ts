import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipController } from './partnership.controller';
import { PartnershipService } from './partnership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { PartnershipModule } from './partnership.module';

describe('PartnershipController', () => {
  let controller: PartnershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), PartnershipModule],
      controllers: [PartnershipController],
      providers: [PartnershipService],
    }).compile();

    controller = module.get<PartnershipController>(PartnershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
