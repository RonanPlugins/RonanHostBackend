import { Test, TestingModule } from '@nestjs/testing';
import { PartnershipRequestController } from './partnership-request.controller';
import { PartnershipRequestService } from './partnership-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';
import { PartnershipRequestModule } from './partnership-request.module';

describe('PartnershipRequestController', () => {
  let controller: PartnershipRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), PartnershipRequestModule],
      controllers: [PartnershipRequestController],
      providers: [PartnershipRequestService],
    }).compile();

    controller = module.get<PartnershipRequestController>(
      PartnershipRequestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
