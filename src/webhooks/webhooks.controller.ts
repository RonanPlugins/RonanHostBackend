import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe/stripe.service';
import { StripeEventDto } from './stripe/stripe.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private stripeService: StripeService) {}

  @Post('stripe')
  handleStripeEvent(@Body() event: StripeEventDto) {
    this.stripeService.handleEvent(event);
  }
}
