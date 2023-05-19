import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { Stripe } from 'stripe';
import { UserService } from '../user/user.service';
import { findAvailableNode } from '../common/node/NodeAllocator';
// import { Builder, Node, Server } from '@avionrx/pterodactyl-js';
import { PteroApp,Node,ClientServer,ApplicationServer } from '@devnote-dev/pterojs';

import * as dotenv from 'dotenv';

dotenv.config();

const PterodactylApp = new PteroApp('https://panel.ronanhost.com', process.env.pterodactylKey);

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: '2022-11-15',
});

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UserService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Body() body,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        'whsec_1063964c9e532dfda4ea7eb183ba7cc5de299ea29313efbbeba29d5e46d7fa3e',
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(`Webhook error`);
    }

    switch (event.type) {
      case 'subscription.created':
        const subServers: number[] = [];
        try {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const customer = <Stripe.Customer>(
            await stripe.customers.retrieve(customerId)
          );
          let userObj;
          try {
            userObj = await this.userService.findOne({
              where: { stripeCustomerId: customer.id },
            });
          } catch (e) {
            if ('email' in customer) {
              try {
                userObj = await this.userService.findOne({
                  where: { email: customer.email },
                });
                userObj.stripeCustomerId = customer.id;
                userObj.save();
              } catch (e) {
                const tempPassword = generateTempPassword();
                userObj = await this.userService.createUser({
                  username: customer.email,
                  email: customer.email,
                  password: tempPassword,
                });
              }
            }
          }
          const pteroUser = await PterodactylApp.users.fetch(String(await userObj.pterodactyl_user_id))
          // Loop through subscription items and create a server for each
          await registerProducts(
            subscription,
            pteroUser,
            res,
            subServers,
            stripe,
            PterodactylApp,
          );

          await stripe.subscriptions
            .update(subscription.id, {
              metadata: {
                servers: JSON.stringify(subServers),
              },
            })
            .catch((e) => {
              console.error(e);
            });
        } catch (e) {
          console.error(e);
        }
        if (subServers.length === 0) {
          throw new Error('Error creating servers');
        }
        res.status(200).send(subServers);
        break;
      default:
        throw new UnprocessableEntityException('Unhandled event type');
    }
  }
}

// Placeholder function for registerProducts
export async function registerProducts(
  subscription,
  pteroUser,
  response,
  subServers,
  stripe,
  pteroClient,
) {
  for (const item of subscription.items.data) {
    for (let i = 0; i < item.quantity; i++) {
      const prodCt = await stripe.products.retrieve(item.plan.product);
      const plan = prodCt.metadata;
      const nId = (
        await findAvailableNode(
          pteroClient,
          Number(plan.memory),
          JSON.parse(plan.nodes),
        )
      )[0];

      /**
       * Fetch the node
       */
      const node: Node = await PterodactylApp.nodes.fetch(nId).catch(() => null);
      if (!node) return response.status(500).json({ status: 'canceled' });
      // Node is not null here
      const availableAllocations = (await PterodactylApp.allocations.fetch(nId))
        .map(v => v)
        .filter((allocation) => allocation.assigned === false)
        .slice(0, Number(plan.allocations) + 1);
      
      const defaultAllocation = availableAllocations[0];
      const additionalAllocations = availableAllocations
        .slice(1, Number(plan.allocations) + 1)
        .map((allocation) => allocation.id);
      const newServer = await pteroClient
        .createServer({
          name: String(pteroUser.firstName) + "'s server",
          user: pteroUser.id,
          egg: 5,
          startup:
            'java -Xms$(({{SERVER_MEMORY}}-512))M -Xmx{{SERVER_MEMORY}}M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 --add-modules=jdk.incubator.vector -jar {{SERVER_JARFILE}} --nogui',
          environment: {
            BUNGEE_VERSION: 'latest',
            BUILD_NUMBER: 'latest',
            SERVER_JARFILE: 'server.jar',
          },
          limits: {
            memory: Number(plan.memory),
            swap: Number(plan.swap),
            disk: Number(plan.disk),
            io: Number(plan.io),
            cpu: Number(plan.cpu),
          },
          featureLimits: {
            allocations: Number(plan.allocations),
            databases: Number(plan.databases),
            backups: Number(plan.backups),
            split_limit: Number(plan.splits),
          },
          allocation: {
            default: defaultAllocation.id,
            additional: additionalAllocations,
          },
          startWhenInstalled: true,
        })
        .catch((e) => {
          console.error(e);
        });

      if (newServer instanceof ApplicationServer) {
        subServers.push(newServer.id);
        console.log(`New server created with id` + newServer.id);
      } else {
        console.error("newServer ain't instanceof Server cuz");
      }
    }
  }
}

// Function to generate a temporary password
function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}
