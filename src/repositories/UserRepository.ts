import BaseRepository from "./Base/BaseRepository.js"
import StripeApiClient from "../util/external/clients/stripe-api-client.js";
import NotFoundError from "../Error/NotFoundError.js";
import Pterodactyl from "@avionrx/pterodactyl-js";
import dotenv from "dotenv"
import User from "../models/User.js";
import crypto from "../util/security/crypto.js"

dotenv.config()

const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY)

export default class UserRepository extends BaseRepository<User> {

    constructor() {
        // @ts-ignore
        super((row: any) => new User(...Object.values(row)));
    }

    async insert(data: User["required"]): Promise<User> {
        data.password = await crypto.hash(data.password)
        return super.insert(data).catch(e => {throw e});
    }

    async create(data: User["required"]): Promise<User> {
        const firstName = data.name.split(' ')[0]
        const lastName = data.name.split(' ')[1]

        const pteroUser = await pteroClient.createUser({
            email: data.email, firstName: firstName, lastName: lastName, username: firstName+lastName
        }).catch(err => {throw err})
        const res:User = await this.insert(data)
        const stripeUser = await stripeApi.createCustomer(
            new User(res.id, data.email, firstName+lastName, pteroUser.id, String(pteroUser.id)))
        return await this.update(res.id, {stripe_customer_id: stripeUser.id, pterodactyl_user_id: pteroUser.id})
    }
    tableName()  {
        return 'user';
    }
    async getByEmail(email: string): Promise<User | NotFoundError> {
        return await super.fetchOne(email)
    }
}