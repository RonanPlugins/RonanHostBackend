export default function Deprecated(reason: string) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            console.warn(`The ${target.constructor.name}#${key} method is deprecated: ${reason}`);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    }
}