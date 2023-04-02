import { Request, Response } from 'express';
import {query} from "../repositories/database.js";
import Stripe from 'stripe';
import StripeApiClient, { Customer } from "../services/stripe-api-client.js";
import CustomerRepository from "../repositories/CustomerRepository.js";

import dotenv from "dotenv"
dotenv.config()
import Pterodactyl, {ServerFeatureLimits, ServerLimits} from '@avionrx/pterodactyl-js';
import {findAvailableNode} from "../util/node/NodeAllocator.js";

const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

// const pteroApi = new PterodactylApiClient('https://panel.ronanhost.com', process.env.PTERODACTYL_API_KEY);
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY)
const customerApi = new CustomerRepository()

export const handleStripeWebhook = async (req: Request, res: Response) => {
    console.log(req)
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.rawBody, sig, "whsec_1063964c9e532dfda4ea7eb183ba7cc5de299ea29313efbbeba29d5e46d7fa3e");

    try {
        switch (event.type) {
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);

                const server = servers.filter(server => String(server.id) === subscription.metadata.server);

                const serFu = await pteroClient.getServer(String(server[0].id))

                const productId = subscription.items.data[0].price.product;

                const plansFDB = await query('SELECT * FROM plan where stripe_product_id = ?', [productId])
                const plan = plansFDB[0]

                const availableNodes = await findAvailableNode(pteroClient, plan.memory)
// Update server feature limits
                const featureLimits: ServerFeatureLimits = {
                    databases: plan.databases,
                    allocations: plan.allocations,
                    backups: plan.backups
                };
                await serFu.setAllocationAmount(featureLimits.allocations);
                await serFu.setDatabaseAmount(featureLimits.databases);
                await serFu.setBackupsAmount(featureLimits.backups);

                const updatedLimits: ServerLimits = {
                    cpu: plan.cpu,
                    disk: plan.disk,
                    io: plan.io,
                    memory: plan.memory,
                    swap: plan.swap,
                }

                await serFu.setCPU(updatedLimits.cpu);
                await serFu.setDisk(updatedLimits.disk);
                await serFu.setIO(updatedLimits.io);
                await serFu.setMemory(updatedLimits.memory);
                await serFu.setSwap(updatedLimits.swap);

                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                const servers = (await pteroClient.getServers()).filter(server => server.user === pteroUser.id);

                const server = servers.filter(server => String(server.id) === subscription.metadata.server);

                const serFu = await pteroClient.getServer(String(server[0].id))
                await serFu.suspend()

                break;
            }
            case 'customer.subscription.created': {
                console.log(event)
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get customer information from a database using Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                // Get plan information from a database using plan ID
                const productId = subscription.items.data[0].price.product;
                const plansFDB = await query('SELECT * FROM plan where stripe_product_id = ?', [productId])
                const plan = plansFDB[0]

                const node = await pteroClient.getNode(String((await findAvailableNode(pteroClient, plan.memory))[0]))

// Create a new server using Pterodactyl API
                const availableAllocation = (await node.getAllocations())
                    .find(allocation => allocation.assigned === false);

                const newServer = await pteroClient.createServer({
                    name: String(pteroUser.firstName) + "'s server",
                    user: pteroUser.id,
                    egg: 1,
                    image: "quay.io/pterodactyl/core:java",
                    startup: "java -Xmx{{MEMORY}} -Xms{{MEMORY}} -jar {{SERVER_JARFILE}} nogui",
                    environment: {
                        "BUNGEE_VERSION": "latest",
                        "SERVER_JARFILE": "server.jar",
                        "MEMORY": plan.memory+ "MB"
                    },
                    limits: {
                        memory: plan.memory,
                        swap: plan.swap,
                        disk: plan.disk,
                        io: plan.io,
                        cpu: plan.cpu
                    },
                    featureLimits: {
                        allocations: plan.allocations,
                        databases: plan.databases,
                        backups: plan.backups
                    },
                    //@ts-ignore
                    allocation: {
                        default: availableAllocation.id,
                        additional: []
                    }
                }).catch(e => {console.error(e)})

                console.log(`New server created with ID: ${newServer}`);

                break;
            }


            // Handle other event types as necessary
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.sendStatus(200);
    } catch (err) {
        console.log("HHGHF"+err);
        res.sendStatus(400);
    }
};
