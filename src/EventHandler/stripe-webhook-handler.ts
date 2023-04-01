import { Request, Response } from 'express';
import {query} from "../repositories/database";
import Stripe from 'stripe';
import PterodactylApiClient, {Server, ServerFeatureLimits, ServerLimits} from '../services/pterodactyl-api-client';
import StripeApiClient, { Customer } from "../services/stripe-api-client";
import CustomerRepository from "../repositories/CustomerRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

const pteroApi = new PterodactylApiClient('https://panel.ronanhost.com', process.env.PTERODACTYL_API_KEY);
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
                const pteroUser = await pteroApi.getUserById(customerObj.pterodactyl_user_id);

                const servers = await pteroApi.getServersByUserId(pteroUser.attributes.id);
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

                // Get customer information from database using Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id);
                const pteroUser = await pteroApi.getUserById(customerObj.pterodactyl_user_id);

                // Get plan information from database using plan ID
                const plansFDB = await query('SELECT * FROM plan where id = ?', [planId])
                const plan = plansFDB[0]

                // Create a new server using Pterodactyl API
                const newServer = await pteroApi.createServer(
                    plan.name, // server name
                    plan.description, // server description
                    pteroUser.attributes.id, // user ID
                    plan.cpu, // CPU limit
                    plan.memory, // memory limit
                    plan.disk, // disk space limit
                    plan.io, // I/O limit
                    plan.swap, // swap space limit
                    plan.threads, // number of threads
                    plan.allocations, // number of allocations
                    plan.databases, // number of databases
                    plan.backups, // number of backups
                    plan.nest, // nest ID
                    plan.egg, // egg ID
                    plan.location // location ID
                );
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
