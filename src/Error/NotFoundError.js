export default class NotFoundError extends Error {
    constructor(entity, query, additionalData = undefined) {
        super(`Ugh! I can't find the ${entity} you're looking for with this query: ${JSON.stringify(query)}. What now?`);
        this.name = "NotFoundError";
        this.statusCode = 404;
        this.entity = entity; // String 'user' for instance
        this.query = query;
        this.timestamp = new Date();
        this.additionalData = additionalData;
        this.emotion = "frustrated";
    }
}
//# sourceMappingURL=NotFoundError.js.map