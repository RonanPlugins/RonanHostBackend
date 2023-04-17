import BaseModel, {RequiredFields} from "./Base/BaseModel.js";
import {AutoAccessor} from "../util/decorators/AutoAccessor.js";
import {UUID} from "../util/functions/UUID.js";

export interface RegistrationRequiredFields extends RequiredFields {
    stripe_customer_id: string;
    data: JSON|string;
    email: string;
    name: string;
}

export default class Registration extends BaseModel<RegistrationRequiredFields> {
    required: RegistrationRequiredFields

    @AutoAccessor()
    public stripe_customer_id: string;
    @AutoAccessor()
    public data: JSON
    @AutoAccessor()
    public email: string;
    @AutoAccessor()
    public name: string;


    constructor(id:UUID, stripe_customer_id: string, data: JSON, email: string, name: string) {
        super(id);
        this.stripe_customer_id = stripe_customer_id;
        this.data = data;
        this.email = email;
        this.name = name;
    }
}