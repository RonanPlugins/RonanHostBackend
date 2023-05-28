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
import { ReferralController } from './referral/referral.controller';
import { ReferralModule } from './referral/referral.module';
import { HealthModule } from './health/health.module';
import { PartnerModule } from './partner/partner.module';
import { PartnerController } from './partner/partner.controller';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
dotenv.config();

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: Number(process.env.DEVTOOLS_PORT),
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    PageModule,
    AuthModule,
    FeedbackModule,
    BannerModule,
    StripeModule,
    ReferralModule,
    HealthModule,
    PartnerModule,
    MetricsModule,
  ],
  controllers: [
    AppController,
    UserController,
    FeedbackController,
    BannerController,
    StripeController,
    ReferralController,
    PartnerController,
    MetricsController,
  ],
  providers: [AppService],
})
export class AppModule {}
