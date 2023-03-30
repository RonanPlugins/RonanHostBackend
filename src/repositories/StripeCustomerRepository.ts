import Stripe from 'stripe';

export default class StripeCustomerRepository {
    private readonly stripe: Stripe;

    constructor(apiKey: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2022-11-15',
        });
    }

    async getCustomerById(customerId: string): Promise<StripeCustomer> {
        const customer = await this.stripe.customers.retrieve(customerId);
        const subscriptions = await this.stripe.subscriptions.list({
            customer: customerId,
        });
        // @ts-ignore
        return new StripeCustomer(customer.id, customer.email, customerId, subscriptions.data);
    }

    async createCustomer(name: string, email: string): Promise<StripeCustomer> {
        const customer = await this.stripe.customers.create({
            name,
            email,
        });
        return new StripeCustomer(customer.id, email, customer.id, []);
    }
}
