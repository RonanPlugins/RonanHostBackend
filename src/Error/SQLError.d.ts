export default class SQLError extends Error {
    private _sqlerror;
    private _conflictingField;
    constructor(content: any, sqlerror: any);
    get sqlerror(): any;
    set sqlerror(value: any);
    get conflictingField(): any;
    set conflictingField(value: any);
}
