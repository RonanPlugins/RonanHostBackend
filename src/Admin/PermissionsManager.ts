class PermissionManager {
    private permissions: Map<string, Set<string>>;

    constructor() {
        this.permissions = new Map<string, Set<string>>();
    }

    addPermission(entity: string, action: string): void {
        if (!this.permissions.has(entity)) {
            this.permissions.set(entity, new Set<string>());
        }
        this.permissions.get(entity)?.add(action);
    }

    checkPermission(entity: string, action: string): boolean {
        return !(!this.permissions.has(entity) || !this.permissions.get(entity)?.has(action)) ?? false;
    }
}
