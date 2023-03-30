export interface ApiKey {
    id: number;
    key: string;
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
    private baseUrl;
    private apiKey;
    private axios;
    constructor(baseUrl: string, apiKey: string);
    getApiKey(apiKeyId: number): Promise<ApiKey>;
    getServers(page?: number, perPage?: number): Promise<PaginatedResponse<Server>>;
}
