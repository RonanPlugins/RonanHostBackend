import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import config from '../../ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([UserEntity]),
        UserModule,
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
