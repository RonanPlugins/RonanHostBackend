import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageModule } from './page.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';

describe('PageController', () => {
  let controller: PageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), PageModule],
      controllers: [PageController],
    }).compile();

    controller = module.get<PageController>(PageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
