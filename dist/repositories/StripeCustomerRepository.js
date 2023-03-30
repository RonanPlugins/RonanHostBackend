import Stripe from 'stripe';
import StripeCustomer from '../models/StripeCustomer';
export default class StripeCustomerRepository {
    constructor(apiKey) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2022-11-15',
        });
    }
    async getCustomerById(customerId) {
        const customer = await this.stripe.customers.retrieve(customerId);
        const subscriptions = await this.stripe.subscriptions.list({
            customer: customerId,
        });
        // @ts-ignore
        return new StripeCustomer(customer.id, customer.email, customerId, subscriptions.data);
    }
    async createCustomer(name, email) {
        const customer = await this.stripe.customers.create({
            name,
            email,
        });
        return new StripeCustomer(customer.id, email, customer.id, []);
    }
}
