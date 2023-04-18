import BaseRepository from "./Base/BaseRepository.js";
import Registration from "../models/Registration.js";
import buildHTML, {sendDynamic} from "../lib/email/build/buildHTML.js";
import {v4} from "../util/functions/UUID.js";
import UserService from "../services/UserService.js";
import UserRepository from "./UserRepository.js";
import {registerProducts} from "../Events/stripe-webhook-handler.js";
import Stripe from "stripe";
import dotenv from "dotenv"
import Pterodactyl from "@avionrx/pterodactyl-js";
import process from "process";
dotenv.config()


const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();

const stripe =new Stripe(process.env.STRIPE_API_KEY, {apiVersion: "2022-11-15"})

const userService = new UserService(new UserRepository())

export default class RegistrationRepository extends BaseRepository<Registration> {
    protected stringFields: string[] = ['id', 'stripe_customer_id', 'data'];

    constructor() {
        // @ts-ignore
        super((row: any) => new Registration(...Object.values(row)));
    }
    tableName()  {
        return 'registrations';
    }

    async prepare(data:any, stripe_customer_id: string, email: string, name:string):Promise<Registration> {
        const uid = v4();
        const registration = await super.insert({
            data: JSON.stringify(data), id: uid, stripe_customer_id: stripe_customer_id, email: email, name: name
        })

        const sd = await sendDynamic(email, undefined, "Register an account",
            "d-6c1921db7ebe4f33a3550be7fbd9d425", {"registrationLink":"https://ronanhost.com/register?token="+uid})
            .catch(e => {console.error(e);
                return undefined; })

        return registration || undefined;
    }

    async finalize(token, username, password, response) {
        try {
            const reg = await super.fetchOne(token)
            // @ts-ignore
            const parsedData = (await JSON.parse(reg.data))[0]
            const user = await userService.createFromStripeCallback({
                email: reg.email, name: reg.name, id: v4(), username: username, password: password
            }, reg.stripe_customer_id);
            const subscription = await stripe.subscriptions.retrieve(await parsedData.subscription)
            let subServers = []
            await registerProducts(subscription, await user.pterodactyl_user, response, subServers, stripe, pteroClient)
            await stripe.subscriptions.update(subscription.id, {
                metadata: {
                    servers: JSON.stringify(subServers)
                }
            });
            return response.status(200).send("success", subServers);
        } catch (e) {
            return response.status(500).send(e)
        }
    }

}