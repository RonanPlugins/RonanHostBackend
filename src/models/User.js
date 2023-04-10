var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Pterodactyl from "@avionrx/pterodactyl-js";
import dotenv from "dotenv";
import BaseModel from "./Base/BaseModel.js";
import { AutoAccessor } from "#decorators/AutoAccessor";
dotenv.config();
const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
export class User extends BaseModel {
    constructor(id, email, name, pterodactyl_user_id, stripe_customer_id) {
        super(id);
        this.email = email;
        this.name = name;
        this.pterodactyl_user_id = pterodactyl_user_id;
        this.stripe_customer_id = stripe_customer_id;
    }
    async loadPterodactylUser() {
        this._pterodactyl_user = await pteroClient.getUser(String(this.pterodactyl_user_id));
    }
    get pterodactyl_user() {
        if (!this._pterodactyl_user) {
            return this.loadPterodactylUser();
        }
        return this._pterodactyl_user;
    }
    async loadStripeCustomer() {
        // const response = await axios.get(`/api/customers/${this._stripe_customer_id}`);
        this._stripe_customer = null;
    }
    get stripe_customer() {
        if (!this._stripe_customer) {
            return this.loadStripeCustomer();
        }
        return this._stripe_customer;
    }
}
__decorate([
    AutoAccessor()
], User.prototype, "email", void 0);
__decorate([
    AutoAccessor()
], User.prototype, "name", void 0);
__decorate([
    AutoAccessor()
], User.prototype, "pterodactyl_user_id", void 0);
__decorate([
    AutoAccessor()
], User.prototype, "stripe_customer_id", void 0);
