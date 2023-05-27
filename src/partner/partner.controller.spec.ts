import { Test, TestingModule } from '@nestjs/testing';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

describe('PartnerController', () => {
  let controller: PartnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerController],
      providers: [PartnerService],
    }).compile();

    controller = module.get<PartnerController>(PartnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
