export enum Permissions {

    // Page permissions
    PAGE_READ = 1,
    PAGE_ADD = 2,
    PAGE_MODIFY = 4,
    PAGE_DELETE = 8,
    PAGE_ALL = PAGE_READ|PAGE_ADD|PAGE_MODIFY|PAGE_DELETE,

    // Global permissions
    READ =  PAGE_READ,
    ADD = PAGE_ADD,
    MODIFY = PAGE_MODIFY,
    DELETE = PAGE_DELETE,
    ALL =  READ|ADD|MODIFY|DELETE,
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
export function getGrantedPermissionsNames(permissions: number): Array<string> {
    const grantedPermissions: Array<number> = getGrantedPermissions(permissions);
    const permissionNames: Array<string> = [];

    for (const permission of grantedPermissions) {
        const permissionName = Permissions[permission];
        if (permissionName) {
            permissionNames.push(permissionName);
        }
    }

    return permissionNames;
}

export function getPermissionInteger(permissions: Permissions[]): number {
    return permissions.reduce((acc, val) => acc | val, 0);
}