export default class SQLError extends Error {
    constructor(content, sqlerror) {
        super(content);
        this._sqlerror = sqlerror;
        this._conflictingField = sqlerror.message.split("'")[1];
    }
    get sqlerror() {
        return this._sqlerror;
    }
    set sqlerror(value) {
        this._sqlerror = value;
    }
    get conflictingField() {
        return this._conflictingField;
    }
    set conflictingField(value) {
        this._conflictingField = value;
    }
}
//# sourceMappingURL=SQLError.js.map