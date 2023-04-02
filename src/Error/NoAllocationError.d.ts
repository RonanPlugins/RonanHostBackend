import { Node } from "@avionrx/pterodactyl-js";
export default class NoNodeAllocationsError extends Error {
    private node;
    private emotion;
    static contact: string;
    constructor(node: Node);
}
