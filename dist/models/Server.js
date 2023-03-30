export default class Server {
    constructor(id, external_id, uuid, name, description, suspended, node_id, allocation_id, nest_id, egg_id, pack_id, container, updated_at, created_at) {
        this._id = id;
        this._external_id = external_id;
        this._uuid = uuid;
        this._name = name;
        this._description = description;
        this._suspended = suspended;
        this._node_id = node_id;
        this._allocation_id = allocation_id;
        this._nest_id = nest_id;
        this._egg_id = egg_id;
        this._pack_id = pack_id;
        this._container = container;
        this._updated_at = updated_at;
        this._created_at = created_at;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get external_id() {
        return this._external_id;
    }
    set external_id(value) {
        this._external_id = value;
    }
    get uuid() {
        return this._uuid;
    }
    set uuid(value) {
        this._uuid = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get suspended() {
        return this._suspended;
    }
    set suspended(value) {
        this._suspended = value;
    }
    get node_id() {
        return this._node_id;
    }
    set node_id(value) {
        this._node_id = value;
    }
    get allocation_id() {
        return this._allocation_id;
    }
    set allocation_id(value) {
        this._allocation_id = value;
    }
    get nest_id() {
        return this._nest_id;
    }
    set nest_id(value) {
        this._nest_id = value;
    }
    get egg_id() {
        return this._egg_id;
    }
    set egg_id(value) {
        this._egg_id = value;
    }
    get pack_id() {
        return this._pack_id;
    }
    set pack_id(value) {
        this._pack_id = value;
    }
    get container() {
        return this._container;
    }
    set container(value) {
        this._container = value;
    }
    get updated_at() {
        return this._updated_at;
    }
    set updated_at(value) {
        this._updated_at = value;
    }
    get created_at() {
        return this._created_at;
    }
    set created_at(value) {
        this._created_at = value;
    }
}
