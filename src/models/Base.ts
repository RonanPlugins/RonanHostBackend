import {UUID} from "../types/UUID";

export default class Base {
    private _id: UUID;
    constructor(id) {
        this._id = id;
    }


    get id(): UUID {
        return this._id;
    }

    set id(value: UUID) {
        this._id = value;
    }

    public async toJSON(exclude: string[] = []) {
        const publicProperties = Object.getOwnPropertyNames(this).filter(key => !key.startsWith("_") && !exclude.includes(key));
        const entries = publicProperties.map(key => [key, this[key]]);
        const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this));
        const publicDescriptors = Object.keys(descriptors).reduce((acc, key) => {
            const descriptor = descriptors[key];
            if (!key.startsWith("_") && typeof descriptor.value !== "function" && !exclude.includes(key)) {
                acc[key] = descriptor;
            }
            return acc;
        }, {});
        try {
            const publicEntries = await Promise.all(Object.entries(publicDescriptors).map(async ([key, descriptor]) => {
                // @ts-ignore
                const value = await descriptor.get.call(this);
                return [key, value];
            }));
            const result = Object.fromEntries([...entries, ...publicEntries]);
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}