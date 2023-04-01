export default class DuplicateError extends Error {
    private statusCode;
    private entity;
    private query;
    private timestamp;
    private conflictingField;
    private emotion;
    constructor(entity: any, query: any, sqlerror: any);
}
