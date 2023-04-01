import axios from 'axios';
export default class PterodactylApiClient {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.axios = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }
    async getApiKey(apiKeyId) {
        const response = await this.axios.get(`/api/application/users/api-keys/${apiKeyId}`);
        return response.data;
    }
    async createUser(firstName, lastName, email) {
        const response = await this.axios.post('/api/application/users', {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: firstName + lastName
        });
        return response.data;
    }
    async getServers(page = 1, perPage = 10) {
        const config = {
            params: {
                page,
                'per_page': perPage,
            },
        };
        const response = await this.axios.get('/api/application/servers', config);
        return response.data;
    }
    async getServerById(serverId) {
        const response = await this.axios.get(`/api/application/servers/${serverId}`);
        return response.data;
    }
    async updateServerLimits(serverId, limits) {
        const response = await this.axios.patch(`/api/application/servers/${serverId}/limits`, limits);
        return response.data;
    }
    async getServersByUserId(userId) {
        const config = {
            params: {
                filter: `user==${userId}`,
            },
        };
        const response = await this.axios.get('/api/application/servers', config);
        return response.data.data.map((serverList) => serverList.attributes);
    }
    async updateServerFeatureLimits(serverId, featureLimits) {
        const response = await this.axios.patch(`/api/application/servers/${serverId}/feature-limits`, featureLimits);
        return response.data;
    }
    async suspendServer(serverId) {
        const response = await this.axios.post(`/api/application/servers/${serverId}/suspend`);
        if (response.status !== 204) {
            throw new Error(`Failed to suspend server with ID ${serverId}`);
        }
    }
    async getEggByUuid(eggUuid) {
        const response = await this.axios.get(`/api/application/nests/eggs/${eggUuid}`);
        return response.data;
    }
    async findNodeForAllocation(allocation) {
        const response = await this.axios.get(`/api/application/nodes`, {
            params: {
                'filter[public]': 'true',
                'filter[location_id]': allocation.node_location_id,
                'filter[resources][memory]': `>=${allocation.memory}`,
                'filter[resources][disk]': `>=${allocation.disk}`,
                'filter[resources][cpu]': `>=${allocation.cpu}`,
                'filter[resources][io]': `>=${allocation.io}`,
            },
        });
        if (response.data.data.length === 0) {
            throw new Error(`No available nodes found for allocation with ID ${allocation.id}`);
        }
        return response.data.data[0].attributes;
    }
    async createAllocation(allocation, nodeId) {
        const response = await this.axios.post('/api/application/nodes/allocations', {
            ip: allocation.ip,
            alias: allocation.alias,
            port: allocation.port,
            notes: allocation.notes,
            'allocation_id': allocation.id,
            'node_id': nodeId,
        });
        return response.data;
    }
    // TODO ARR4NN SET UP MULTI-EGG
    async createServer(userId, subscriptionId, serverName, plan) {
        const user = await this.getUserById(userId);
        const allocation = await this.createAllocation(user);
        const node = await this.findNodeForAllocation(allocation);
        const egg = await this.getEggByUuid(plan.egg);
        const dockerImage = egg.docker_image.split(':')[0] + ':' + plan.docker_tag;
        const variables = egg.variables?.map(variable => {
            return {
                ...variable,
                value: plan[variable.env_variable]
            };
        });
        const response = await this.axios.post('/api/application/servers', {
            name: serverName,
            user: user.attributes.uuid,
            nest: egg.nest_id,
            egg: egg.uuid,
            docker_image: dockerImage,
            startup: egg.startup,
            environment: variables,
            limits: {
                memory: plan.memory,
                swap: plan.swap,
                disk: plan.disk,
                io: plan.io,
                cpu: plan.cpu,
                threads: plan.threads
            },
            feature_limits: {
                databases: plan.databases,
                allocations: plan.allocations,
                backups: plan.backups
            },
            allocation: allocation.attributes.id,
            node: node.attributes.id
        }, {
            headers: {
                'Stripe-Subscription': subscriptionId
            }
        });
        return response.data;
    }
    async getUsers(page = 1, perPage = 10) {
        const config = {
            params: {
                page,
                'per_page': perPage,
            },
        };
        const response = await this.axios.get('/api/application/users', config);
        return response.data;
    }
    async getUserById(userId) {
        const response = await this.axios.get(`/api/application/users/${userId}`);
        return response.data;
    }
    async getUserByUsername(username) {
        const config = {
            params: {
                'filter': `username==${username}`,
            },
        };
        const response = await this.axios.get('/api/application/users', config);
        if (response.data.data.length === 0) {
            throw new Error(`User with username "${username}" not found`);
        }
        return response.data.data[0];
    }
    async getUserByEmail(email) {
        const config = {
            params: {
                'filter': `email==${email}`,
            },
        };
        const response = await this.axios.get('/api/application/users', config);
        if (response.data.data.length === 0) {
            throw new Error(`User with email "${email}" not found`);
        }
        return response.data.data[0];
    }
}
