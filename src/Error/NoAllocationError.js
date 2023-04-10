export default class NoNodeAllocationsError extends Error {
    constructor(node) {
        super(`Oh no! All node allocations are full for node ${node}. Please contact ${NoNodeAllocationsError.contact} for assistance.`);
        this.name = "NoNodeAllocationsError";
        this.node = node;
        this.emotion = "disappointed";
    }
}
NoNodeAllocationsError.contact = "support@ronanplugins.com";
//# sourceMappingURL=NoAllocationError.js.map