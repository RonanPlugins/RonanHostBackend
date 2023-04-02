import Pterodactyl from "@avionrx/pterodactyl-js";
import dotenv from "dotenv";
dotenv.config();
const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
export default class Customer {
    constructor(id, email, name, stripe_customer_id = undefined, pterodactyl_user_id = undefined) {
        this._id = id;
        this._email = email;
        this._name = name;
        this._stripe_customer_id = stripe_customer_id;
        this._pterodactyl_user_id = pterodactyl_user_id;
    }
    async loadStripeCustomer() {
        // const response = await axios.get(`/api/customers/${this._stripe_customer_id}`);
        this._stripe_customer = null;
    }
    async loadPterodactylUser() {
        this._pterodactyl_user = await pteroClient.getUser(String(this.pterodactyl_user_id));
    }
    get stripe_customer() {
        if (!this._stripe_customer) {
            return this.loadStripeCustomer();
        }
        return this._stripe_customer;
    }
    get pterodactyl_user() {
        if (!this._pterodactyl_user) {
            return this.loadPterodactylUser();
        }
        return this._pterodactyl_user;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get stripe_customer_id() {
        return this._stripe_customer_id;
    }
    set stripe_customer_id(value) {
        this._stripe_customer_id = value;
    }
    get pterodactyl_user_id() {
        return this._pterodactyl_user_id;
    }
    set pterodactyl_user_id(value) {
        this._pterodactyl_user_id = value;
    }
}
