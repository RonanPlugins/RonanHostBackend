export async function findAvailableNode(client, memoryNeeded) {
    try {
        const nodes = await client.getNodes();
        for (const node of nodes) {
            const servers = (await client.getServers())
                .filter((server) => server.node === node.id);
            const usedMemory = servers.reduce((acc, server) => acc + server.limits.memory, 0);
            console.log(node.memory);
            if ((usedMemory + memoryNeeded) <= node.memory)
                return node.id;
        }
        return null;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
