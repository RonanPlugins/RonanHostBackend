export default class SQLError extends Error {
    private _sqlerror: any
    private _conflictingField: any;
    constructor(content, sqlerror) {
        super(content);
        this._sqlerror = sqlerror;
        this._conflictingField = sqlerror.message.split("'")[1];
    }


    get sqlerror(): any {
        return this._sqlerror;
    }

    set sqlerror(value: any) {
        this._sqlerror = value;
    }

    get conflictingField(): any {
        return this._conflictingField;
    }

    set conflictingField(value: any) {
        this._conflictingField = value;
    }
}