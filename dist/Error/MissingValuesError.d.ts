export default class MissingValuesError extends Error {
    private _statusCode;
    private _missingValues;
    private _emotion;
    get statusCode(): number;
    set statusCode(value: number);
    get missingValues(): any;
    set missingValues(value: any);
    get emotion(): string;
    set emotion(value: string);
    constructor(missingValues: any);
}
