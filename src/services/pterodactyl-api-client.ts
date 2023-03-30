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
}
