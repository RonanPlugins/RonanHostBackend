import BaseModel, {RequiredFields} from "./Base/BaseModel.js";
import {AutoAccessor} from "../util/decorators/AutoAccessor.js";
import Memorize from "../util/decorators/Memorize.js";

interface BannerRequiredFields extends RequiredFields{
    minutes_between_popup: number;
    click_url: string;
    text: string;
    enabled: boolean;
    allow_close: boolean;
}
export default class Banner extends BaseModel<BannerRequiredFields> {
    required: BannerRequiredFields;

    @AutoAccessor()
    public minutes_between_popup: number;
    @AutoAccessor()
    public click_url: string;
    @AutoAccessor()
    public text: string;
    @AutoAccessor()
    public enabled: boolean;
    @AutoAccessor()
    public allow_close: boolean;


    constructor(id, required: BannerRequiredFields, minutes_between_popup: number, click_url: string, text: string, enabled: boolean, allow_close: boolean) {
        super(id);
        this.required = required;
        this.minutes_between_popup = minutes_between_popup;
        this.click_url = click_url;
        this.text = text;
        this.enabled = enabled;
        this.allow_close = allow_close;
    }

    @Memorize()
    async toJSON(exclude: string[] = []): Promise<{ [p: string]: any }> {
        return super.toJSON(exclude);
    }
}