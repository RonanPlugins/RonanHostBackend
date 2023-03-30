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
}
