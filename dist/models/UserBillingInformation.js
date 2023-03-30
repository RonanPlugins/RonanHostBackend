export default class UserBillingInformation {
    constructor(id, customerId, defaultPaymentMethodId) {
        this._id = id;
        this._customerId = customerId;
        this._defaultPaymentMethodId = defaultPaymentMethodId;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get customerId() {
        return this._customerId;
    }
    set customerId(value) {
        this._customerId = value;
    }
    get defaultPaymentMethodId() {
        return this._defaultPaymentMethodId;
    }
    set defaultPaymentMethodId(value) {
        this._defaultPaymentMethodId = value;
    }
}
