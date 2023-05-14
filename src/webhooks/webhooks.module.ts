import { Module } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [StripeModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
