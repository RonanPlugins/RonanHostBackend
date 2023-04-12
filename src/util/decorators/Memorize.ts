export default function Memorize() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = memoizeAsync(originalMethod);
        return descriptor;
    }
}


export function memoizeAsync(fn: (...args: any[]) => Promise<any>): (...args: any[]) => Promise<any> {
    const cache = new Map();
    return async function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = await fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}