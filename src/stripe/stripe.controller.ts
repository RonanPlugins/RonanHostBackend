import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  RawBodyRequest,
  Req,
  Res, UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { Stripe } from 'stripe';
import { UserService } from '../user/user.service';
import { findAvailableNode } from '../common/node/NodeAllocator';
import { AdminClient, Builder, Node, Server } from '@avionrx/pterodactyl-js';

import * as dotenv from 'dotenv';

dotenv.config();

const pteroManager: AdminClient = new Builder()
  .setURL(process.env.PTERODACTYL_BASE_URL)
  .setAPIKey(process.env.PTERODACTYL_API_KEY)
  .asAdmin();

console.log(pteroManager);

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
    @Req() request: RawBodyRequest<Request>,
  ) {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        'whsec_1063964c9e532dfda4ea7eb183ba7cc5de299ea29313efbbeba29d5e46d7fa3e',
      );
    } catch (err) {
      throw new InternalServerErrorException(`Webhook error`);
    }

    switch (event.type) {
      case 'customer.subscription.created':
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
            if (!userObj) throw new Error('Non existent customer.id');
          } catch (e) {
            if ('email' in customer) {
              try {
                userObj = await this.userService.findOne({
                  where: { email: customer.email },
                });
                userObj = await this.userService.updateUser(userObj.id, {
                  stripeCustomerId: customer.id,
                });
              } catch (e) {
                const tempPassword = generateTempPassword();
                const names = customer.name.split(' ');
                const ptU = await pteroManager.createUser({
                  firstName: names[0],
                  lastName: names[1],
                  username: `${names[0]}-${Math.floor(Math.random() * 1e6)
                    .toString()
                    .padStart(6, '0')}`,
                  email: customer.email,
                });
                const crUs = await this.userService.createUser({
                  username: customer.email,
                  email: customer.email,
                  password: tempPassword,
                });
                userObj = await this.userService.updateUser(crUs.id, {
                  pterodactylUserId: String(ptU.id),
                  stripeCustomerId: customer.id,
                });
              }
            }
          }
          const pteroUser = await pteroManager.getUser(
            String(userObj.pterodactylUserId),
          );
          // Loop through subscription items and create a server for each
          await registerProducts(
            subscription,
            pteroUser,
            res,
            subServers,
            stripe,
            pteroManager,
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
      const node: Node = await pteroManager
        .getNode(String(nId))
        .catch(() => null);
      if (!node) return response.status(500).json({ status: 'canceled' });
      // Node is not null here
      const availableAllocations = (await node.getAllocations())
        .map((v) => v)
        .filter((allocation) => allocation.assigned === false)
        .slice(0, Number(plan.allocations) + 1);

      const defaultAllocation = availableAllocations[0];
      const additionalAllocations = availableAllocations
        .slice(1, Number(plan.allocations) + 1)
        .map((allocation) => allocation.id);
      console.log(pteroManager, node);
      const newServer = await pteroManager
        .createServer({
          name: String(pteroUser.firstName) + "'s server",
          user: pteroUser.id,
          egg: 5,
          image: 'ghcr.io/pterodactyl/yolks:java_17',
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

      if (newServer instanceof Server) {
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
