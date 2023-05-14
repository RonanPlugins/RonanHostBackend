import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StripeEventDto } from './stripe.dto';
import { Stripe } from 'stripe';
import { UserService } from '../../user/user.service';

@Injectable()
export class StripeService {
  constructor(private userService: UserService) {}
  handleEvent(event: StripeEventDto) {
    switch (event.type) {
      case 'customer.created':
        this.handleCustomerCreated(event.data.object);
        break;
      default:
        throw new HttpException(
          'Event type not supported',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  private async handleCustomerCreated(customer: Stripe.Customer) {
    const username = customer.name;
    const email = customer.email;

    // Generate a temporary password for the new user
    const password = Math.random().toString(36).slice(-8);

    await this.userService.createUser(username, email, password);
  }
}
