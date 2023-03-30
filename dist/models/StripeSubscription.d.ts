export default class StripeSubscription {
    private _id;
    private _status;
    private _billingCycleAnchor;
    private _currentPeriodStart;
    private _currentPeriodEnd;
    private _planId;
    constructor(id: string, status: string, billingCycleAnchor: Date, currentPeriodStart: Date, currentPeriodEnd: Date, planId: string);
    get id(): string;
    set id(value: string);
    get status(): string;
    set status(value: string);
    get billingCycleAnchor(): Date;
    set billingCycleAnchor(value: Date);
    get currentPeriodStart(): Date;
    set currentPeriodStart(value: Date);
    get currentPeriodEnd(): Date;
    set currentPeriodEnd(value: Date);
    get planId(): string;
    set planId(value: string);
}
