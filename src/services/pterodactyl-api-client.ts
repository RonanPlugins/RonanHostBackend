import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {UUID} from "../types/UUID";

export interface ApiKey {
    id: number;
    key: string;
    created_at: string;
    updated_at: string;
}

interface User {
    "attributes": {
        "id": number,
        "external_id": string,
        "uuid": UUID
        "username": string
        "email": string
        "first_name": string,
        "last_name": string,
        "language": string,
        "root_admin": Boolean,
        "2fa": Boolean,
        "created_at": Date,
        "updated_at": Date
    }
}

interface Egg {
    id: number;
    uuid: string;
    nest: number;
    author: string;
    name: string;
    description: string;
    docker_image: string;
    config: {
        files: {
            name: string;
            mode: string;
            contents: string;
        }[];
        startup: string;
        stop: string;
    };
    startup: string;
    script: {
        privileged: boolean;
        install: string;
        entry: string;
    };
    created_at: string;
    updated_at: string;
}

interface Allocation {
    id: number;
    ip: string;
    alias: string;
    port: number;
    notes: string;
    assigned: boolean;
    created_at: string;
    updated_at: string;
}


export interface Server {
    id: number;
    external_id: string | null;
    uuid: string;
    name: string;
    description: string | null;
    suspended: boolean;
    limits: ServerLimits;
    feature_limits: ServerFeatureLimits;
    user: number;
    node: number;
    allocation: number;
    nest: number;
    egg: number;
    container: {
        startup_command: string;
        image: string;
        installed: boolean;
        environment: Record<string, string>;
    };
    updated_at: string;
    created_at: string;
}

export interface ServerLimits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: number | null;
}

export interface ServerFeatureLimits {
    databases: number;
    allocations: number;
    backups: number;
}

interface ServerList {
    attributes: Server;
}


export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        pagination: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
}

export default class PterodactylApiClient {
    private axios: AxiosInstance;

    constructor(private baseUrl: string, private apiKey: string) {
        this.axios = axios.create({
            baseURL: baseUrl,
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }

    async getApiKey(apiKeyId: number): Promise<ApiKey> {
        const response = await this.axios.get<ApiKey>(`/api/application/users/api-keys/${apiKeyId}`);
        return response.data;
    }

    async createUser(firstName: string, lastName: string, email: string): Promise<User> {
        const response = await this.axios.post<User>('/api/application/users', {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: firstName+lastName
        });
        return response.data;
    }

    async getServers(page = 1, perPage = 10): Promise<PaginatedResponse<Server>> {
        const config: AxiosRequestConfig = {
            params: {
                page,
                'per_page': perPage,
            },
        };
        const response = await this.axios.get<PaginatedResponse<Server>>('/api/application/servers', config);
        return response.data;
    }
    async getServerById(serverId: number): Promise<Server> {
        const response = await this.axios.get<Server>(`/api/application/servers/${serverId}`);
        return response.data;
    }
    async updateServerLimits(serverId: number, limits: ServerLimits): Promise<Server> {
        const response = await this.axios.patch<Server>(
            `/api/application/servers/${serverId}/limits`,
            limits
        );
        return response.data;
    }
    async getServersByUserId(userId: number): Promise<Server[]> {
        const config: AxiosRequestConfig = {
            params: {
                filter: `user==${userId}`,
            },
        };
        const response = await this.axios.get<PaginatedResponse<ServerList>>('/api/application/servers', config);
        return response.data.data.map((serverList) => serverList.attributes);
    }


    async updateServerFeatureLimits(serverId: number, featureLimits: ServerFeatureLimits): Promise<Server> {
        const response = await this.axios.patch<Server>(
            `/api/application/servers/${serverId}/feature-limits`,
            featureLimits
        );
        return response.data;
    }
    async suspendServer(serverId: number): Promise<void> {
        const response = await this.axios.post(`/api/application/servers/${serverId}/suspend`);
        if (response.status !== 204) {
            throw new Error(`Failed to suspend server with ID ${serverId}`);
        }
    }
    async getEggByUuid(eggUuid: string): Promise<Egg> {
        const response = await this.axios.get<Egg>(`/api/application/nests/eggs/${eggUuid}`);
        return response.data;
    }

    async findNodeForAllocation(allocation: Allocation): Promise<Node> {
        const response = await this.axios.get<PaginatedResponse<Node>>(`/api/application/nodes`, {
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

    async createAllocation(allocation: Allocation, nodeId: number): Promise<Allocation> {
        const response = await this.axios.post<Allocation>('/api/application/nodes/allocations', {
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
    async createServer(userId: number, subscriptionId: string, serverName: string, plan: Plan): Promise<Server> {
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

        const response = await this.axios.post<Server>(
            '/api/application/servers',
            {
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
            },
            {
                headers: {
                    'Stripe-Subscription': subscriptionId
                }
            }
        );

        return response.data;
    }




    async getUsers(page = 1, perPage = 10): Promise<PaginatedResponse<User>> {
        const config: AxiosRequestConfig = {
            params: {
                page,
                'per_page': perPage,
            },
        };
        const response = await this.axios.get<PaginatedResponse<User>>('/api/application/users', config);
        return response.data;
    }

    async getUserById(userId: number): Promise<User> {
        const response = await this.axios.get<User>(`/api/application/users/${userId}`);
        return response.data;
    }

    async getUserByUsername(username: string): Promise<User> {
        const config: AxiosRequestConfig = {
            params: {
                'filter': `username==${username}`,
            },
        };
        const response = await this.axios.get<PaginatedResponse<User>>('/api/application/users', config);
        if (response.data.data.length === 0) {
            throw new Error(`User with username "${username}" not found`);
        }
        return response.data.data[0];
    }

    async getUserByEmail(email: string): Promise<User> {
        const config: AxiosRequestConfig = {
            params: {
                'filter': `email==${email}`,
            },
        };
        const response = await this.axios.get<PaginatedResponse<User>>('/api/application/users', config);
        if (response.data.data.length === 0) {
            throw new Error(`User with email "${email}" not found`);
        }
        return response.data.data[0];
    }
}
