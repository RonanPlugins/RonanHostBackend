import SQLError from "./SQLError.js";
export default class DuplicateError extends SQLError {
    constructor(entity, query, sqlerror) {
        super(`Seriously? There's already a ${entity} with this info: ${JSON.stringify(query)}. Can you try something different?`, sqlerror);
        this.name = "DuplicateError";
        this.statusCode = 409;
        this.entity = entity; // String 'user' for instance
        this.query = query;
        this.timestamp = new Date();
        this.emotion = "annoyed";
    }
}
//# sourceMappingURL=DuplicateError.js.map