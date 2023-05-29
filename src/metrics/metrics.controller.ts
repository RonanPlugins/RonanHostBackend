import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminClient, Builder } from '@avionrx/pterodactyl-js';
import * as ping from 'ping';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../user/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';

const pteroManager: AdminClient = new Builder()
  .setURL(process.env.PTERODACTYL_BASE_URL)
  .setAPIKey(process.env.PTERODACTYL_API_KEY)
  .asAdmin();

@Controller('metrics')
@UseGuards(JwtAuthGuard, RoleAuthGuard)
@Roles(UserRole.ADMIN)
export class MetricsController {
  @Get()
  async fullReport() {
    const nodeReport = await this.nodes();
    const userReport = await this.userCount();
    return { nodes: nodeReport, userCount: userReport };
  }

  @Get('users')
  async userCount(): Promise<number> {
    return (await pteroManager.getUsers()).length;
  }
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
