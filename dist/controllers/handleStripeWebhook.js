import Stripe from 'stripe';
import PterodactylApiClient from '../services/pterodactyl-api-client';
import { StripeCustomer, StripeSubscription } from '../models';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
const pteroApi = new PterodactylApiClient('https://your-ptero-domain.com', 'your_ptero_api_key');
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');
    try {
        switch (event.type) {
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const customer = await stripe.customers.retrieve(customerId);
                // Get the user's UUID from your database using their Stripe customer ID
                const stripeCustomer = await StripeCustomer.getByCustomerId(customer.id);
                const user = await pteroApi.getUser(stripeCustomer.uuid);
                // Update the user's server allocation based on the new subscription information
                const subscriptionData = new StripeSubscription(subscription);
                const serverAllocation = subscriptionData.toServerAllocation();
                await pteroApi.updateServerAllocation(user, serverAllocation);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const customer = await stripe.customers.retrieve(customerId);
                // Get the user's UUID from your database using their Stripe customer ID
                const stripeCustomer = await StripeCustomer.getByCustomerId(customer.id);
                const user = await pteroApi.getUser(stripeCustomer.uuid);
                // Set the user's server allocation to null
                await pteroApi.updateServerAllocation(user, null);
                break;
            }
            // Handle other event types as necessary
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.sendStatus(200);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
};
