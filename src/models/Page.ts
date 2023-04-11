import {UUID} from "../util/functions/UUID.js";
import {AutoAccessor} from "../util/decorators/AutoAccessor.js";
import BaseModel, {RequiredFields} from "./Base/BaseModel.js";

export interface PageRequiredFields extends RequiredFields {
    name: string;
    content: string;
}
export default class Page extends BaseModel<PageRequiredFields> {
    required: PageRequiredFields;

    @AutoAccessor()
    public name: string;
    @AutoAccessor()
    public content: string

    constructor(id: UUID, name: string, content: string) {
        super(id)
        this.name = name;
        this.content = content;
    }
}