import { Request, Response } from 'express';
import Stripe from 'stripe';
import PterodactylApiClient, { Server } from '../services/pterodactyl-api-client';
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
                const customerObj = await customerApi.getCustomerByStripeId(customer.id)
                const pteroUser = await pteroApi.getUserById(customerObj.pterodactyl_user_id);

                // Update the user's server allocation based on the new subscription information
                const serverAllocation: Server | null = {
                    id: pteroUser.attributes.id,
                    external_id: null,
                    uuid: pteroUser.attributes.uuid,
                    name: pteroUser.attributes.username,
                    description: null,
                    suspended: false,
                    node_id: 0,
                    allocation_id: 0,
                    nest_id: 0,
                    egg_id: 0,
                    pack_id: null,
                    container: {
                        start_command: '',
                        image: '',
                        installed: false,
                        environment: {},
                    },
                    updated_at: '',
                    created_at: '',
                };
                await pteroApi.updateServerAllocation(pteroUser, serverAllocation);

                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const customer = await stripe.customers.retrieve(customerId);

                // Get the customer's information from your database using their Stripe customer ID
                const stripeCustomer = await stripeApi.getCustomer(customer.id);
                const customerObj = await customerApi.getCustomerByStripeId(customer.id)
                const pteroUser = await pteroApi.getUserById(customerObj.pterodactyl_user_id);

                // Set the user's server allocation to null
                await pteroApi.updateServerAllocation(pteroUser, null);

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
