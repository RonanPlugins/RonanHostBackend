export default class UserBillingInformation {
    private _id;
    private _customerId;
    private _defaultPaymentMethodId;
    constructor(id: string, customerId: string, defaultPaymentMethodId: string);
    get id(): string;
    set id(value: string);
    get customerId(): string;
    set customerId(value: string);
    get defaultPaymentMethodId(): string;
    set defaultPaymentMethodId(value: string);
}
