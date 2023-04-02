import SQLError from "./SQLError.js";
export default class DuplicateError extends SQLError {
    private statusCode;
    private entity;
    private query;
    private timestamp;
    private emotion;
    constructor(entity: any, query: any, sqlerror: any);
}
