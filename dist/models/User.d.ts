import { UUID } from "../types/UUID";
export default class User {
    private _uuid;
    private _username;
    private _first_name;
    private _last_name;
    private _email;
    constructor(uuid: UUID, username: string, first_name: string, last_name: string, email: string);
    get uuid(): UUID;
    set uuid(value: UUID);
    get username(): string;
    set username(value: string);
    get first_name(): string;
    set first_name(value: string);
    get last_name(): string;
    set last_name(value: string);
    get email(): string;
    set email(value: string);
}
