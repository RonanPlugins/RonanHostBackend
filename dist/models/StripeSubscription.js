export default class StripeSubscription {
    constructor(id, status, billingCycleAnchor, currentPeriodStart, currentPeriodEnd, planId) {
        this._id = id;
        this._status = status;
        this._billingCycleAnchor = billingCycleAnchor;
        this._currentPeriodStart = currentPeriodStart;
        this._currentPeriodEnd = currentPeriodEnd;
        this._planId = planId;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get billingCycleAnchor() {
        return this._billingCycleAnchor;
    }
    set billingCycleAnchor(value) {
        this._billingCycleAnchor = value;
    }
    get currentPeriodStart() {
        return this._currentPeriodStart;
    }
    set currentPeriodStart(value) {
        this._currentPeriodStart = value;
    }
    get currentPeriodEnd() {
        return this._currentPeriodEnd;
    }
    set currentPeriodEnd(value) {
        this._currentPeriodEnd = value;
    }
    get planId() {
        return this._planId;
    }
    set planId(value) {
        this._planId = value;
    }
}
