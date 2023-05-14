import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../ormconfig';

// @Module({
//   imports: [TypeOrmModule.forFeature([UserEntity])],
//   providers: [UserService],
//   exports: [TypeOrmModule, UserService],
//   controllers: [UserController],
// })
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), UserModule],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
