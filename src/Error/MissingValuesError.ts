export default class MissingValuesError extends Error {
    private _statusCode: number;
    private _missingValues: any;
    private _emotion: string;


    get statusCode(): number {
        return this._statusCode;
    }

    set statusCode(value: number) {
        this._statusCode = value;
    }

    get missingValues(): any {
        return this._missingValues;
    }

    set missingValues(value: any) {
        this._missingValues = value;
    }

    get emotion(): string {
        return this._emotion;
    }

    set emotion(value: string) {
        this._emotion = value;
    }

    constructor(missingValues) {
        const message = `Oh, come on! You forgot these values: ${missingValues.join(', ')}. Can you double-check and try again?`;
        super(message);
        this.name = 'MissingValuesError';
        this._statusCode = 400;
        this._missingValues = missingValues;
        this._emotion = "exasperated";
    }
}