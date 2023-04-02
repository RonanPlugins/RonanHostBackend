import { UUID } from "../types/UUID";
export default class Customer {
    private _id;
    private _email;
    private _name;
    private _stripe_customer_id;
    private _pterodactyl_user_id;
    private _stripe_customer;
    private _pterodactyl_user;
    constructor(id: UUID, email: string, name: string, stripe_customer_id?: string, pterodactyl_user_id?: number);
    loadStripeCustomer(): Promise<void>;
    loadPterodactylUser(): Promise<void>;
    get stripe_customer(): any;
    get pterodactyl_user(): any;
    get id(): UUID;
    set id(value: UUID);
    get email(): string;
    set email(value: string);
    get name(): string;
    set name(value: string);
    get stripe_customer_id(): string;
    set stripe_customer_id(value: string);
    get pterodactyl_user_id(): number;
    set pterodactyl_user_id(value: number);
}
