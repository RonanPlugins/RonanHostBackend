export default class BillingPlan {
    private _id;
    private _name;
    private _description;
    private _price;
    constructor(id: string, name: string, description: string, price: number);
    get id(): string;
    set id(value: string);
    get name(): string;
    set name(value: string);
    get description(): string;
    set description(value: string);
    get price(): number;
    set price(value: number);
}
