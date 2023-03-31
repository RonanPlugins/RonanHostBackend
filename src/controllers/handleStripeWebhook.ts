import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeWebhookHandler } from '../services/stripe-webhook-handler';
import PterodactylApiClient from '../services/pterodactyl-api-client';
import StripeApiClient from "../services/stripe-api-client";
import CustomerRepository from "../repositories/CustomerRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

const pteroApi = new PterodactylApiClient(process.env.PTERODACTYL_BASE_URL, process.env.PTERODACTYL_API_KEY);
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY);
const customerRepo = new CustomerRepository();

const webhookHandler = new StripeWebhookHandler(stripeApi, pteroApi, customerRepo);

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    try {
        await webhookHandler.handleEvent(event);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
};
