import { Request, Response } from 'express';
import {query} from "../repositories/database";
import Stripe from 'stripe';
import StripeApiClient, { Customer } from "../services/stripe-api-client";
import CustomerRepository from "../repositories/CustomerRepository";

import dotenv from "dotenv"
dotenv.config()
import Pterodactyl from 'pterodactyl.js';

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
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');

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

                const servers = (await pteroClient.getServers()).filter(server => server.user === 1);
                const userServers = servers.filter(server => server.user === 1);

                const server = servers[0];

                const planId = subscription.metadata.plan_id;

                const plansFDB = await query('SELECT * FROM plan where id = ?', [planId])
                const plan = plansFDB[0]



                // Update server feature limits
                const featureLimits: ServerFeatureLimits = {
                    databases: plan.databases,
                    allocations: plan.allocations,
                    backups: plan.backups
                };
                await pteroApi.updateServerFeatureLimits(server.id, featureLimits);

                // Update server limits
                const planPrice = subscription.items.data[0].price.unit_amount;
                const serverPrice = server.limits.memory * server.limits.disk * server.limits.io;

                const updatedLimits: ServerLimits = {
                    cpu: plan.cpu,
                    disk: plan.disk,
                    io: plan.io,
                    memory: plan.memory,
                    swap: plan.swap,
                    threads: plan.threads
                };
                await pteroApi.updateServerLimits(server.id, updatedLimits);

                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id);
                const pteroUser = await pteroApi.getUserById(customerObj.pterodactyl_user_id);

                const servers = await pteroApi.getServersByUserId(pteroUser.attributes.id);
                const server = servers[0];

                // Suspend the server
                await pteroApi.suspendServer(server.id);

                break;
            }
            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;
                const planId = subscription.metadata.plan_id;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get customer information from a database using Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id);
                const pteroUser = await pteroClient.getUser(String(customerObj.pterodactyl_user_id));

                // Get plan information from a database using plan ID
                const plansFDB = await query('SELECT * FROM plan where id = ?', [planId])
                const plan = plansFDB[0]

// Create a new server using Pterodactyl API
                const newServer = await pteroClient.createServer({
                    allocation: {additional: []},
                    deploy: {dedicatedIp: false, portRange: [25565, 25566]},
                    description: "My new Minecraft server",
                    egg: 1,
                    environment: {"SERVER_JARFILE": "server.jar", "MEMORY": "2G"},
                    externalId: "",
                    featureLimits: {allocations: 0, databases: 0},
                    image: "minecraft",
                    limits: {memory: plan.memory, swap: 0, disk: plan.disk, io: 500, cpu: 0},
                    name: "My Minecraft Server",
                    outOfMemoryKiller: false,
                    pack: undefined,
                    skipScripts: false,
                    startWhenInstalled: false,
                    startup: "java -Xmx{{MEMORY}} -Xms{{MEMORY}} -jar {{SERVER_JARFILE}} nogui",
                    user: pteroUser.id
                });
                console.log(`New server created with ID: ${newServer.id}`);

                break;
            }


            // Handle other event types as necessary
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
};
