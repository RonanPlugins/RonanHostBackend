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
import { FeedbackController } from './feedback/feedback.controller';
import { BannerController } from './banner/banner.controller';
import * as dotenv from 'dotenv';
import { FeedbackModule } from './feedback/feedback.module';
import { BannerModule } from './banner/banner.module';
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
    FeedbackModule,
    BannerModule,
  ],
  controllers: [
    AppController,
    UserController,
    FeedbackController,
    BannerController,
  ],
  providers: [AppService],
})
export class AppModule {}
