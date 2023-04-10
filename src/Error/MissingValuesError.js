export default class MissingValuesError extends Error {
    constructor(missingValues) {
        const message = `Oh, come on! You forgot these values: ${missingValues.join(', ')}. Can you double-check and try again?`;
        super(message);
        this.name = 'MissingValuesError';
        this._statusCode = 400;
        this._missingValues = missingValues;
        this._emotion = "exasperated";
    }
    get statusCode() {
        return this._statusCode;
    }
    set statusCode(value) {
        this._statusCode = value;
    }
    get missingValues() {
        return this._missingValues;
    }
    set missingValues(value) {
        this._missingValues = value;
    }
    get emotion() {
        return this._emotion;
    }
    set emotion(value) {
        this._emotion = value;
    }
}
