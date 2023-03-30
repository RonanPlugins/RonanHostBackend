import StripeCustomer from '../models/StripeCustomer';
export default class StripeCustomerRepository {
    private readonly stripe;
    constructor(apiKey: string);
    getCustomerById(customerId: string): Promise<StripeCustomer>;
    createCustomer(name: string, email: string): Promise<StripeCustomer>;
}
