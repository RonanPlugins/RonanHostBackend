import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { NodeactylClient } from 'nodeactyl'; // import nodeactyl client

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private nodeactylClient: NodeactylClient; // instantiate nodeactyl client

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_API_KEY'), {
      apiVersion: '2022-11-15',
    });
    // initialize nodeactyl client
    this.nodeactylClient = new NodeactylClient({
      base_url: this.configService.get('PTERODACTYL_BASE_URL'),
      api_key: this.configService.get('PTERODACTYL_API_KEY'),
    });
  }

  async constructEvent(body: any) {
    // Implement stripe webhook event construction here
  }

  async handleSubscriptionUpdated(event: any) {
    // Implement stripe subscription update logic here
  }

  // Add other methods...
}
