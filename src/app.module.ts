import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormconfig';
import { UserService } from './user/user.service';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PageModule } from './page/page.module';
import { PageService } from './page/page.service';
import { PageController } from './page/page.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    PageModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
