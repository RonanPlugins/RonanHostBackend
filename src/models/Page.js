export default class Page {
    constructor(id, name, content) {
        this._id = id;
        this._name = name;
        this._content = content;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this._content = value;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            content: this.content
        };
    }
}
//# sourceMappingURL=Page.js.map