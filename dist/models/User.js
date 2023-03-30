export default class User {
    constructor(uuid, username, first_name, last_name, email) {
        this._uuid = uuid;
        this._username = username;
        this._first_name = first_name;
        this._last_name = last_name;
        this._email = email;
    }
    get uuid() {
        return this._uuid;
    }
    set uuid(value) {
        this._uuid = value;
    }
    get username() {
        return this._username;
    }
    set username(value) {
        this._username = value;
    }
    get first_name() {
        return this._first_name;
    }
    set first_name(value) {
        this._first_name = value;
    }
    get last_name() {
        return this._last_name;
    }
    set last_name(value) {
        this._last_name = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
}
