import {UUID} from "../types/UUID";
import Pterodactyl from "@avionrx/pterodactyl-js";
import dotenv from "dotenv"
import Base from "./Base.js";
dotenv.config()


const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();

export class User extends Base {
    private _email: string;
    private _name: string;
    private _pterodactyl_user_id: number;
    private _pterodactyl_user: any;
    private _stripe_customer_id: string;
    private _stripe_customer: any;

    constructor(id: UUID, email: string, name: string, pterodactyl_user_id: number, stripe_customer_id: string) {
        super(id)
        this._email = email;
        this._name = name;
        this._pterodactyl_user_id = pterodactyl_user_id;
        this._stripe_customer_id = stripe_customer_id;
    }

    protected async loadPterodactylUser(): Promise<void> {
        this._pterodactyl_user = await pteroClient.getUser(String(this.pterodactyl_user_id));
    }

    protected get pterodactyl_user(): any {

        if (!this._pterodactyl_user) {
            return this.loadPterodactylUser();
        }
        return this._pterodactyl_user;
    }
    async loadStripeCustomer(): Promise<void> {
        // const response = await axios.get(`/api/customers/${this._stripe_customer_id}`);
        this._stripe_customer = null;
    }

    get stripe_customer(): any {
        if (!this._stripe_customer) {
            return this.loadStripeCustomer();
        }
        return this._stripe_customer;
    }

    get stripe_customer_id(): string {
        return this._stripe_customer_id;
    }

    set stripe_customer_id(value: string) {
        this._stripe_customer_id = value;
    }

    get pterodactyl_user_id(): number {
        return this._pterodactyl_user_id;
    }

    set pterodactyl_user_id(value: number) {
        this._pterodactyl_user_id = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

}