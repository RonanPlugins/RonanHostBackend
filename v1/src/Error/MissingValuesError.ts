import {AutoAccessor} from "../util/decorators/AutoAccessor.js";

export default class MissingValuesError extends Error {
    @AutoAccessor()
    public name: string;
    @AutoAccessor()
    public statusCode: number;
    @AutoAccessor()
    public missingValues: any;
    @AutoAccessor()
    public emotion: string;

    constructor(missingValues) {
        const message = `Oh, come on! You forgot these values: ${missingValues.join(', ')}. Can you double-check and try again?`;
        super(message);
        this.name = 'MissingValuesError';
        this.statusCode = 400;
        this.missingValues = missingValues;
        this.emotion = "exasperated";
    }
}