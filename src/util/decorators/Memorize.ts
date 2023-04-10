export default function memoize(fn: (...args: any[]) => any): (...args: any[]) => any {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

export async function memoizeAsync(fn: (...args: any[]) => Promise<any>): Promise<(...args: any[]) => Promise<any>> {
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
