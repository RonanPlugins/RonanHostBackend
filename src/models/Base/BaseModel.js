var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AutoAccessor } from "#decorators/AutoAccessor";
export default class BaseModel {
    constructor(id) {
        this.id = id;
    }
    async toJSON(exclude = []) {
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
__decorate([
    AutoAccessor()
], BaseModel.prototype, "id", void 0);
