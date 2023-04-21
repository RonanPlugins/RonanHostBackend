import {Node, Server} from "@avionrx/pterodactyl-js"

export async function findAvailableNode(client, memoryNeeded, nodesFilter = null): Promise<number[] | null> {
    const availableNodes = [];
    try {
        let nodes = await client.getNodes();

        if (nodesFilter) nodes = nodes.filter((node) => nodesFilter.includes(node.id));

        for (const node of nodes) {
            const servers = (await client.getServers())
                .filter((server: Server) =>
                    server.node === node.id);

            const usedMemory = servers.reduce((acc, server) => acc + server.limits.memory, 0);
            if ((usedMemory + memoryNeeded) <= node.memory) availableNodes.push(node.id);
        }

        return availableNodes;
    } catch (error) {
        console.error("fan", error);
        return null;
    }
}

interface NodeWithAllocatedMemory extends Node {
    totalAllocatedMemory: number;
}

export async function getTotalAllocatedMemoryByNode(client): Promise<NodeWithAllocatedMemory[]> {
    const nodesWithAllocatedMemory: NodeWithAllocatedMemory[] = [];
    try {
        const nodes = await client.getNodes();
        const servers = await client.getServers();

        for (const node of nodes) {
            const nodeServers = servers.filter((server: Server) => server.node === node.id);
            const totalAllocatedMemory = nodeServers.reduce((acc, server) => acc + server.limits.memory, 0);

            const nodeWithAllocatedMemory: NodeWithAllocatedMemory = { ...node, totalAllocatedMemory };
            nodesWithAllocatedMemory.push(nodeWithAllocatedMemory);
        }

        return nodesWithAllocatedMemory;
    } catch (error) {
        console.error(error);
        return [];
    }
}