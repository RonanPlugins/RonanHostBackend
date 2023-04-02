import Stripe from 'stripe';
export default class StripeApiClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2022-11-15',
        });
    }
    async createCustomer(customer) {
        const stripeCustomer = await this.stripe.customers.create({
            email: customer.email,
            name: customer.name,
            description: customer.description,
        });
        return {
            id: stripeCustomer.id,
            email: stripeCustomer.email,
            name: stripeCustomer.name,
            description: stripeCustomer.description,
        };
    }
    async getCustomer(customerId) {
        const stripeCustomer = await this.stripe.customers.retrieve(customerId);
        if (stripeCustomer.deleted) {
            return undefined;
        }
        return {
            id: stripeCustomer.id,
            // @ts-ignore
            email: stripeCustomer?.email,
            // @ts-ignore
            name: stripeCustomer?.name,
            // @ts-ignore
            description: stripeCustomer?.description,
        };
    }
    async updateCustomer(customerId, updates) {
        const stripeCustomer = await this.stripe.customers.update(customerId, updates);
        return {
            id: stripeCustomer.id,
            email: stripeCustomer.email,
            name: stripeCustomer.name,
            description: stripeCustomer.description,
        };
    }
    async deleteCustomer(customerId) {
        await this.stripe.customers.del(customerId);
    }
}
