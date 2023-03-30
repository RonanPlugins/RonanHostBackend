import Stripe from 'stripe';
export default class StripeCustomer {
    private _id;
    private _email;
    private _customerId;
    private _subscriptions;
    constructor(id: string, email: string, customerId: string, subscriptions: Stripe.Subscription[]);
    get id(): string;
    set id(value: string);
    get email(): string;
    set email(value: string);
    get customerId(): string;
    set customerId(value: string);
    get subscriptions(): Stripe.Subscription[];
    set subscriptions(value: Stripe.Subscription[]);
}
