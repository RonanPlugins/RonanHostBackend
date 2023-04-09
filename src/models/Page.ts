type UUID = string & { readonly __brand: unique symbol };
export default class Page {
    private _id: UUID;
    private _name: string;
    private _content: string;

    get id(): UUID {
        return this._id;
    }

    set id(value: UUID) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }


    constructor(id: UUID, name: string, content: string) {
        this._id = id;
        this._name = name;
        this._content = content;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            content: this.content
        }
    }
}