import Customer from '../models/Customer.js';
import type { UUID } from '../types/UUID';
export default class CustomerRepository {
    createCustomer(email: string, firstName: string, lastName: string): Promise<Customer>;
    getCustomerByEmail(email: string): Promise<Customer | undefined>;
    getCustomerById(id: UUID): Promise<Customer | undefined>;
    getCustomerByStripeId(id: string): Promise<Customer | undefined>;
    getCustomerByPteroId(id: string): Promise<Customer | undefined>;
    protected updateCustomerEmail(id: number, email: string): Promise<void>;
    protected deleteCustomer(id: number): Promise<void>;
}
