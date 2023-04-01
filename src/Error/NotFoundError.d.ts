export default class NotFoundError extends Error {
    private statusCode;
    private entity;
    private query;
    private timestamp;
    private additionalData;
    private emotion;
    constructor(entity: any, query: any, additionalData?: any);
}
