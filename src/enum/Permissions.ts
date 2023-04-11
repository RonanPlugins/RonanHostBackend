export enum Permissions {
    // Global permissions
    GLOBAL_ALL = 1,
    GLOBAL_READ = 2,
    GLOBAL_ADD = 4,
    GLOBAL_MODIFY = 8,
    GLOBAL_DELETE = 16,

    // Page permissions
    PAGE_ALL = 32,
    PAGE_READ = 64,
    PAGE_ADD = 128,
    PAGE_MODIFY = 256,
    PAGE_DELETE = 512,
}

export function getGrantedPermissions(permissions: number): Array<number> {
    const grantedPermissions: Array<number> = [];

    for (const value of Object.values(Permissions)) {
        if (typeof value === 'number' && permissions & value) {
            grantedPermissions.push(value);
        }
    }

    return grantedPermissions;
}

export function getPermissionInteger(permissions: Permissions[]): number {
    return permissions.reduce((acc, val) => acc | val, 0);
}