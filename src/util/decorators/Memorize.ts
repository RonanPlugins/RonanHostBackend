function memoizeAsync(fn: (...args: any[]) => Promise<any>): { memoizedFn: (...args: any[]) => Promise<any>, updateCache: (...args: any[]) => Promise<any> } {
    const cache = new WeakMap();
    const memoizedFn = async function (...args) {
        const key = JSON.stringify(args);
        let instanceCache = cache.get(this);
        if (!instanceCache) {
            instanceCache = new Map();
            cache.set(this, instanceCache);
        }
        if (instanceCache.has(key)) {
            return instanceCache.get(key);
        }
        const result = await fn.apply(this, args);
        instanceCache.set(key, result);
        return result;
    };

    const updateCache = async function (...args) {
        const key = JSON.stringify(args);
        let instanceCache = cache.get(this);
        if (!instanceCache) {
            instanceCache = new Map();
            cache.set(this, instanceCache);
        }
        const result = await fn.apply(this, args);
        instanceCache.set(key, result);
        return result;
    };

    return { memoizedFn, updateCache };
}

export function Memorize() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const { memoizedFn, updateCache } = memoizeAsync(originalMethod);
        descriptor.value = memoizedFn;
        descriptor.value.updateCache = updateCache;
        return descriptor;
    };
}
export function UpdateCacheOnUpdate() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await originalMethod.apply(this, args);

            // Find all methods with a cache and update them
            for (const methodName of Object.getOwnPropertyNames(this)) {
                const method = this[methodName];
                if (typeof method === "function" && method.updateCache) {
                    await method.updateCache();
                }
            }

            return result;
        };
        return descriptor;
    };
}
export function ResetCache() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await originalMethod.apply(this, args);
            // Reset the cache for all memoized methods in the class
            for (const methodName of Object.keys(target)) {
                if (target[methodName].updateCache) {
                    target[methodName].updateCache();
                }
            }
            return result;
        };
        return descriptor;
    };
}
