export default class StripeCustomer {
    constructor(id, email, customerId, subscriptions) {
        this._id = id;
        this._email = email;
        this._customerId = customerId;
        this._subscriptions = subscriptions;
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
    get customerId() {
        return this._customerId;
    }
    set customerId(value) {
        this._customerId = value;
    }
    get subscriptions() {
        return this._subscriptions;
    }
    set subscriptions(value) {
        this._subscriptions = value;
    }
}
