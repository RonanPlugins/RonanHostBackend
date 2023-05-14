import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../ormconfig';
import { UserService } from './user/user.service';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { WebhooksController } from './webhooks/webhooks.controller';
import { PterodactylModule } from './pterodactyl/pterodactyl.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { StripeModule } from './webhooks/stripe/stripe.module';
import { WebhooksController } from './webhooks/webhooks.controller';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    StripeModule,
    WebhooksModule,
    PterodactylModule,
  ],
  controllers: [AppController, UserController, WebhooksController],
  providers: [AppService, UserService],
})
export class AppModule {}
