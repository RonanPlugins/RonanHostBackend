import { query } from './database.js';
import type {UUID} from '../types/UUID';
import { v4 as uuidv4 } from 'uuid';
import StripeApiClient from "../services/stripe-api-client.js";
import NotFoundError from "../Error/NotFoundError.js";
import DuplicateError from "../Error/DuplicateError.js";
import Pterodactyl from "@avionrx/pterodactyl-js";
import Stripe from "stripe";
import dotenv from "dotenv"
import {User} from "../models/User";
import {createHash} from "crypto";
import crypto from "../util/security/crypto";

dotenv.config()

const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY)

export default class UserRepository {

    async create(email: string, firstName:string, lastName:string, password: string): Promise<User> {
        const insId = uuidv4() as UUID;

        const pteroUser = await pteroClient.createUser({
            email: email, firstName: firstName, lastName: lastName, username: firstName+lastName

        }).catch(err => {throw err})
        const stripeUser = await stripeApi.createCustomer(
            new User(insId, email, firstName+lastName, undefined, String(pteroUser.id)))
        const name = firstName+lastName;

        const result = await query('INSERT INTO user (id, email, name, stripe_customer_id, pterodactyl_user_id, password) VALUES (?, ?, ?, ?, ?, ?)',
            [insId, email, name, stripeUser.id, pteroUser.id, crypto.hash(password)]).catch(error => {
            if (error.code === "ER_DUP_ENTRY") {
                const field = error.message.split("'")[1];
                throw new DuplicateError('User', {
                    values: {
                        insId,
                        email,
                        name
                    }
                }, error)
            }
            throw error;
        })
        return new User(insId, email, firstName+lastName, pteroUser.id, stripeUser.id);
    }

    async getByEmail(email: string): Promise<User | undefined> {
        const rows = await query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { email: email });
        }
        // @ts-ignore
        return new User(...Object.values(rows[0]));
    }
    async getById(id: UUID): Promise<User | undefined> {
        const rows = await query('SELECT * FROM user WHERE id = ?', [id]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { id: id });
        }
        // @ts-ignore
        return new User(...Object.values(rows[0]));
    }
    async getByPteroId(id: string|number): Promise<User | undefined> {
        const rows = await query('SELECT * FROM user WHERE pterodactyl_user_id = ?', [id]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { pterodactyl_user_id: id });
        }
        // @ts-ignore
        return new User(...Object.values(rows[0]));
    }

    async getCustomerByStripeId(id: string): Promise<User | undefined> {
        const rows = await query('SELECT * FROM user WHERE stripe_customer_id = ?', [id]);
        if (rows.length === 0) {
            return undefined;
        }
        if (!rows.length) {
            throw new NotFoundError('User', { stripe_customer_id: id });
        }
        // @ts-ignore
        return new User(...Object.values(rows[0]));
    }

     async updateEmail(id: number, email: string): Promise<void> {
        await query('UPDATE user SET email = ? WHERE id = ?', [email, id]);
    }

     async delete(id: number): Promise<void> {
        await query('DELETE FROM user WHERE id = ?', [id]);
    }
}