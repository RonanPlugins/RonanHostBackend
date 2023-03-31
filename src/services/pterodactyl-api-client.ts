import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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

export interface Server {
    id: number;
    external_id: string | null;
    uuid: string;
    name: string;
    description: string | null;
    suspended: boolean;
    node_id: number;
    allocation_id: number;
    nest_id: number;
    egg_id: number;
    pack_id: number | null;
    container: {
        start_command: string;
        image: string;
        installed: boolean;
        environment: Record<string, string>;
    };
    updated_at: string;
    created_at: string;
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
