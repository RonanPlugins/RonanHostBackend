import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity/user.entity';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';
import { UserController } from './user.controller';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
})
export class UserModule {}
