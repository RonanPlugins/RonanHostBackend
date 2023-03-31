export default class DuplicateError extends Error {
    private statusCode: number;
    private entity: any;
    private query: any;
    private timestamp: Date;
    private conflictingField: any;
    private emotion: string;
    constructor(entity, query, sqlerror) {
        super(`Seriously? There's already a ${entity} with this info: ${JSON.stringify(query)}. Can you try something different?`);
        this.name = "DuplicateError";
        this.statusCode = 409;
        this.entity = entity; // String 'user' for instance
        this.query = query;
        this.timestamp = new Date()
        this.conflictingField = sqlerror.message.split("'")[1];
        this.emotion = "annoyed";
    }
}