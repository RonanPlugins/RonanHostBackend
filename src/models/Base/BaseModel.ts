import {UUID} from "../../types/UUID";
import {AutoAccessor, AutoAccessors} from "#decorators/AutoAccessor";

export interface RequiredFields {
    id: UUID;
}
export default class BaseModel<T extends RequiredFields = RequiredFields> {
    @AutoAccessor()
    public id: UUID;
    constructor(id) {
        this.id = id;
    }

    public async toJSON(exclude: string[] = []):Promise<{[p: string]: any}> {
        const publicProperties = Object.getOwnPropertyNames(this).filter(key => !key.startsWith("_") && !exclude.includes(key));
        const publicEntries = await Promise.all(Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))).map(async ([key, descriptor]) => {
            if (!key.startsWith("_") && typeof descriptor.value !== "function" && !exclude.includes(key)) {
                return [key, await descriptor.get.call(this)];
            }
        }));
        // @ts-ignore
        return Object.fromEntries([...publicProperties, ...publicEntries.filter(entry => entry)]);
    }

}