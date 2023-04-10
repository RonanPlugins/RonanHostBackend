import Stripe from 'stripe';

export interface Customer {
    id: string;
    email: string;
    name: string;
    description?: string;
}

interface DeletedCustomer {
    id: string;
    deleted: true;
}

export default class StripeApiClient {
    private stripe: Stripe;

    constructor(private apiKey: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2022-11-15',
        });
    }

    async createCustomer(customer: Customer): Promise<Customer> {
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

    async getCustomer(customerId: string): Promise<Customer | undefined> {
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

    async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer> {
        const stripeCustomer = await this.stripe.customers.update(customerId, updates);

        return {
            id: stripeCustomer.id,
            email: stripeCustomer.email,
            name: stripeCustomer.name,
            description: stripeCustomer.description,
        };
    }

    async deleteCustomer(customerId: string): Promise<void> {
        await this.stripe.customers.del(customerId);
    }
}