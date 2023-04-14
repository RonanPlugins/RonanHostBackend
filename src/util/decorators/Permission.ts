import {getGrantedPermissions, getGrantedPermissionsNames, Permissions} from "../../enum/Permissions.js";

export function RequiresPermission(requiredPermission: Permissions) {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor,
    ): void {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const grantedPermissions: Permissions[] = getGrantedPermissions(this.permissions);

            if (grantedPermissions.includes(requiredPermission)) {
                return originalMethod.apply(this, args);
            } else {
                throw new Error(`Permission ${Permissions[requiredPermission]} is required.`);
            }
        };
    };
}