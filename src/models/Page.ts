import {UUID} from "../util/functions/UUID.js";
import {AutoAccessor} from "../util/decorators/AutoAccessor.js";
import BaseModel, {RequiredFields} from "./Base/BaseModel.js";
import {Memorize} from "../util/decorators/Memorize.js";

export interface PageRequiredFields extends RequiredFields {
    name: string;
    content: string;
    title: string;
}
export default class Page extends BaseModel<PageRequiredFields> {
    required: PageRequiredFields;

    @AutoAccessor()
    public name: string;
    @AutoAccessor()
    public content: string
    @AutoAccessor()
    public title: string

    constructor(id: UUID, name: string, content: string,title: string) {
        super(id)
        this.name = name;
        this.content = content;
        this.title = title;
    }

    @Memorize()
    async toJSON(exclude: string[] = []): Promise<{ [p: string]: any }> {
        return super.toJSON(exclude);
    }
}