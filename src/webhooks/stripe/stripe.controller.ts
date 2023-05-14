import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeEventDto } from './stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post()
  handleStripeEvent(@Body() event: StripeEventDto) {
    this.stripeService.handleEvent(event);
  }
}
