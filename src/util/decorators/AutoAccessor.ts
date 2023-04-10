export function Accessor(target: any, key: string) {
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
    return function (target: any, key: string) {
        Accessor(target, key);
        const constructor = target.constructor;
        if (!constructor._autoAccessors) {
            constructor._autoAccessors = [];
        }
        constructor._autoAccessors.push(key);
    };
}

export function AutoAccessors(constructor: any) {
    if (constructor._autoAccessors) {
        constructor._autoAccessors.forEach((key: string) => {
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