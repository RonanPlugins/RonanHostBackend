import { Controller, Get } from '@nestjs/common';
import { AdminClient, Builder } from '@avionrx/pterodactyl-js';
import * as ping from 'ping';

const pteroManager: AdminClient = new Builder()
  .setURL(process.env.PTERODACTYL_BASE_URL)
  .setAPIKey(process.env.PTERODACTYL_API_KEY)
  .asAdmin();

@Controller('metrics')
export class MetricsController {
  @Get('nodes')
  async nodes(): Promise<any[]> {
    const servers = await pteroManager.getServers();
    const nodes = await pteroManager.getNodes();
    const nodeMetrics: { [key: string]: any } = {};

    // Initial setup for nodeMetrics
    for (const node of nodes) {
      const latency = await this.pingNode(node.fqdn);
      nodeMetrics[node.id] = {
        nodeId: node.id,
        nodeName: node.name,
        maxMemory: node.memory,
        allocatedMemory: 0,
        latency,
        maxDisk: node.disk,
        allocatedDisk: 0,
        numberOfServers: 0,
        suspendedServers: 0,
      };
    }

    // Loop through all servers
    for (const server of servers) {
      // Check if server's node_id is in our nodeMetrics object
      if (nodeMetrics.hasOwnProperty(server.node)) {
        // Add server's memory and disk to total for this node
        nodeMetrics[server.node].allocatedMemory += server.limits.memory;
        nodeMetrics[server.node].allocatedDisk += server.limits.disk; // Assumes server has disk property
        nodeMetrics[server.node].numberOfServers++;
        if (server.suspended) {
          nodeMetrics[server.node].suspendedServers++;
        }
      }
    }

    // Convert the nodeMetrics object to an array
    return Object.values(nodeMetrics);
  }

  async pingNode(fqdn: string): Promise<number> {
    const res = await ping.promise.probe(fqdn);
    return res.avg;
  }
}
