import {UUID} from "../types/UUID";
import PterodactylApiClient from '../services/pterodactyl-api-client';


const pteroApi = new PterodactylApiClient('https://panel.ronanhost.com', process.env.PTERODACTYL_API_KEY);

export default class Customer {
    private _id: UUID;
    private _email: string;
    private _name: string;
    private _stripe_customer_id: string;
    private _pterodactyl_user_id: number;
    private _stripe_customer: any;
    private _pterodactyl_user: any;

    constructor(id: UUID, email: string, name: string, stripe_customer_id: string = undefined, pterodactyl_user_id: number = undefined) {
        this._id = id;
        this._email = email;
        this._name = name;
        this._stripe_customer_id = stripe_customer_id;
        this._pterodactyl_user_id = pterodactyl_user_id;
    }
    async loadStripeCustomer(): Promise<void> {
        // const response = await axios.get(`/api/customers/${this._stripe_customer_id}`);
        this._stripe_customer = null;
    }

    async loadPterodactylUser(): Promise<void> {
        this._pterodactyl_user = await pteroApi.getUserById(this.pterodactyl_user_id);
    }

    get stripe_customer(): any {
        if (!this._stripe_customer) {
            return this.loadStripeCustomer();
        }
        return this._stripe_customer;
    }

    get pterodactyl_user(): any {
        if (!this._pterodactyl_user) {
            return this.loadPterodactylUser();
        }
        return this._pterodactyl_user;
    }

    get id(): UUID {
        return this._id;
    }

    set id(value: UUID) {
        this._id = value;
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
}