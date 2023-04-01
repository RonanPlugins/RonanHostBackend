export interface Customer {
    id: string;
    email: string;
    name: string;
    description?: string;
}
export default class StripeApiClient {
    private apiKey;
    private stripe;
    constructor(apiKey: string);
    createCustomer(customer: Customer): Promise<Customer>;
    getCustomer(customerId: string): Promise<Customer | undefined>;
    updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer>;
    deleteCustomer(customerId: string): Promise<void>;
}
