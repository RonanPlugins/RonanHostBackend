import Base from "#repositories/Base";
import { query } from '#data/database';
import type {UUID} from '../types/UUID';
import { v4 as uuidv4 } from 'uuid';
import StripeApiClient from "#stripe-api-client";
import NotFoundError from "../Error/NotFoundError.js";
import DuplicateError from "../Error/DuplicateError.js";
import Pterodactyl from "@avionrx/pterodactyl-js";
import Stripe from "stripe";
import dotenv from "dotenv"
import {User} from "../models/User.js";
import {createHash} from "crypto";
import crypto from "../util/security/crypto.js";
import e from "express";

dotenv.config()

const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY)

export default class UserRepo extends Base<User> {

    constructor() {
        // @ts-ignore
        super((row: any) => new User(...Object.values(row)));
    }
    tableName()  {
        return 'user';
    }
    async getByEmail(email: string): Promise<User | undefined> {
        return await super.fetchOne(email)
    }
}