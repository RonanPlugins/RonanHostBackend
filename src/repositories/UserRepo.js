import Base from "./Base.js";
import StripeApiClient from "#stripe-api-client";
import Pterodactyl from "@avionrx/pterodactyl-js";
import dotenv from "dotenv";
import { User } from "../models/User.js";
dotenv.config();
const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
const stripeApi = new StripeApiClient(process.env.STRIPE_API_KEY);
export default class UserRepo extends Base {
    constructor() {
        // @ts-ignore
        super((row) => new User(...Object.values(row)));
    }
    tableName() {
        return 'user';
    }
    async getByEmail(email) {
        return await super.fetchOne(email);
    }
}
//# sourceMappingURL=UserRepo.js.map