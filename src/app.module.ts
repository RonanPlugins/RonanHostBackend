import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormconfig';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PageModule } from './page/page.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackController } from './feedback/feedback.controller';
import { BannerController } from './banner/banner.controller';
import * as dotenv from 'dotenv';
import { FeedbackModule } from './feedback/feedback.module';
import { BannerModule } from './banner/banner.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeController } from './stripe/stripe.controller';
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
    StripeModule,
  ],
  controllers: [
    AppController,
    UserController,
    FeedbackController,
    BannerController,
    StripeController,
  ],
  providers: [AppService],
})
export class AppModule {}
