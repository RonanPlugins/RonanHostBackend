import {UUID} from "../../util/functions/UUID.js";
import {AutoAccessor, AutoAccessors} from "../../util/decorators/AutoAccessor.js";

export interface RequiredFields {
    id: UUID;
}
export default class BaseModel<T extends RequiredFields = RequiredFields> {
    @AutoAccessor()
    public id: UUID;
    constructor(id) {
        this.id = id;
    }

    async toJSON(exclude: string[] = []): Promise<{ [p: string]: any }> {
        return Object.entries(this).reduce(async (accPromise, [key, value]) => {
            const acc = await accPromise;
            if (this.hasOwnProperty(key) && typeof value !== "function" && !exclude.includes(key)) acc[key] = value instanceof Promise ? await value : value;
            return acc;
        }, Promise.resolve({}));
    }

}