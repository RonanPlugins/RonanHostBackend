import { query } from './database';
import Customer from '../models/Customer'; // assuming you have a User model/interface defined
import * as UUID from '../types/UUID';
import PterodactylApiClient from "../services/pterodactyl-api-client";
import StripeApiClient from "../services/stripe-api-client";
import NotFoundError from "../Error/NotFoundError";
import DuplicateError from "../Error/DuplicateError";

const pteroApi = new PterodactylApiClient(process.env.PTERODACTYL_BASE_URL, process.env.PTERODACTYL_API_KEY);
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY)

export default class CustomerRepository {
    async createCustomer(email: string, firstName:string, lastName:string): Promise<Customer> {
        const insId = UUID.newUUID()

        const pteroUser = await pteroApi.createUser(firstName, lastName, email).catch(err => {throw err})
        const stripeUser = await stripeApi.createCustomer(
            new Customer(insId, email, firstName+lastName, undefined, pteroUser.attributes.id))
        const name = firstName+lastName;

        const result = await query('INSERT INTO customer (id, email, name, stripe_customer_id, pterodactyl_user_id) VALUES (?, ?, ?, ?, ?)',
            [insId, email, name, stripeUser.id, pteroUser.attributes.id]).catch(error => {
            if (error.code === "ER_DUP_ENTRY") {
                const field = error.message.split("'")[1];
                throw new DuplicateError('Customer', {
                    values: {
                        insId,
                        email,
                        name
                    }
                }, error)
            }
            throw error;
        })
        return new Customer(insId, email, firstName+lastName, stripeUser.id, pteroUser.attributes.id);
    }

    async getCustomerByEmail(email: string): Promise<Customer | undefined> {
        const rows = await query('SELECT * FROM customer WHERE email = ?', [email]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { email: email });
        }
        // @ts-ignore
        return new Customer(...Object.values(rows[0]));
    }
    async getCustomerById(id: UUID.UUID): Promise<Customer | undefined> {
        const rows = await query('SELECT * FROM customer WHERE id = ?', [id]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { id: id });
        }
        // @ts-ignore
        return new Customer(...Object.values(rows[0]));
    }
    async getCustomerByStripeId(id: string): Promise<Customer | undefined> {
        const rows = await query('SELECT * FROM customer WHERE stripe_customer_id = ?', [id]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { stripe_customer_id: id });
        }
        // @ts-ignore
        return new Customer(...Object.values(rows[0]));
    }
    async getCustomerByPteroId(id: string): Promise<Customer | undefined> {
        const rows = await query('SELECT * FROM customer WHERE pterodactyl_user_id = ?', [id]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { pterodactyl_user_id: id });
        }
        // @ts-ignore
        return new Customer(...Object.values(rows[0]));
    }

    protected async updateCustomerEmail(id: number, email: string): Promise<void> {
        await query('UPDATE customer SET email = ? WHERE id = ?', [email, id]);
    }

    protected async deleteCustomer(id: number): Promise<void> {
        await query('DELETE FROM customer WHERE id = ?', [id]);
    }
}
