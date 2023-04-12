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

    public async toJSON(exclude: string[] = []): Promise<{ [p: string]: any }> {
        const publicProperties = Object.getOwnPropertyNames(this).filter(
            (key) => !key.startsWith("_") && !exclude.includes(key)
        );
        const publicGetters = Object.entries(
            Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))
        ).filter(([key, descriptor]) => {
            return (
                !key.startsWith("_") &&
                descriptor.get &&
                typeof descriptor.value !== "function" &&
                !exclude.includes(key)
            );
        });

        const publicEntries = await Promise.all(
            publicGetters.map(async ([key, descriptor]) => {
                const value = await descriptor.get.call(this);
                return [key, value];
            })
        );

        const resolvedEntries = await Promise.all(
            publicEntries.map(async ([key, value]) => {
                if (value instanceof Promise) {
                    value = await value;
                }
                return [key, value];
            })
        );

        // @ts-ignore
        return Object.fromEntries([...publicProperties, ...resolvedEntries]);
    }
}