import {Node} from "@avionrx/pterodactyl-js";

export default class NoNodeAllocationsError extends Error {
    private node: Node;
    private emotion: string;
    public static contact: string = "support@ronanplugins.com";

    constructor(node: Node) {
        super(`Oh no! All node allocations are full for node ${node}. Please contact ${NoNodeAllocationsError.contact} for assistance.`);
        this.name = "NoNodeAllocationsError";
        this.node = node;
        this.emotion = "disappointed";
    }
}
