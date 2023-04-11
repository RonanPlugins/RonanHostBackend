export function Accessor(target, key) {
    Object.defineProperty(target, key, {
        get() {
            return this["_" + key];
        },
        set(value) {
            this["_" + key] = value;
        },
    });
}
export function AutoAccessor() {
    return function (target, key) {
        Accessor(target, key);
        const constructor = target.constructor;
        if (!constructor._autoAccessors) {
            constructor._autoAccessors = [];
        }
        constructor._autoAccessors.push(key);
    };
}
export function AutoAccessors(constructor) {
    if (constructor._autoAccessors) {
        constructor._autoAccessors.forEach((key) => {
            Object.defineProperty(constructor.prototype, key, {
                get() {
                    return this["_" + key];
                },
                set(value) {
                    this["_" + key] = value;
                },
            });
        });
    }
}
