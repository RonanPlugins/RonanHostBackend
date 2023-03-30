export default class Node {
    constructor(id, uuid, publicFlag, name, description, locationId, fqdn, scheme, behindProxy, memory, memoryOverallocate, disk, diskOverallocate, uploadSize, daemonListen, daemonSftp, daemonBase, createdAt, updatedAt) {
        this._id = id;
        this._uuid = uuid;
        this._public = publicFlag;
        this._name = name;
        this._description = description;
        this._location_id = locationId;
        this._fqdn = fqdn;
        this._scheme = scheme;
        this._behind_proxy = behindProxy;
        this._memory = memory;
        this._memory_overallocate = memoryOverallocate;
        this._disk = disk;
        this._disk_overallocate = diskOverallocate;
        this._upload_size = uploadSize;
        this._daemon_listen = daemonListen;
        this._daemon_sftp = daemonSftp;
        this._daemon_base = daemonBase;
        this._created_at = createdAt;
        this._updated_at = updatedAt;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get uuid() {
        return this._uuid;
    }
    set uuid(value) {
        this._uuid = value;
    }
    get public() {
        return this._public;
    }
    set public(value) {
        this._public = value;
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
    get location_id() {
        return this._location_id;
    }
    set location_id(value) {
        this._location_id = value;
    }
    get fqdn() {
        return this._fqdn;
    }
    set fqdn(value) {
        this._fqdn = value;
    }
    get scheme() {
        return this._scheme;
    }
    set scheme(value) {
        this._scheme = value;
    }
    get behind_proxy() {
        return this._behind_proxy;
    }
    set behind_proxy(value) {
        this._behind_proxy = value;
    }
    get memory() {
        return this._memory;
    }
    set memory(value) {
        this._memory = value;
    }
    get memory_overallocate() {
        return this._memory_overallocate;
    }
    set memory_overallocate(value) {
        this._memory_overallocate = value;
    }
    get disk() {
        return this._disk;
    }
    set disk(value) {
        this._disk = value;
    }
    get disk_overallocate() {
        return this._disk_overallocate;
    }
    set disk_overallocate(value) {
        this._disk_overallocate = value;
    }
    get upload_size() {
        return this._upload_size;
    }
    set upload_size(value) {
        this._upload_size = value;
    }
    get daemon_listen() {
        return this._daemon_listen;
    }
    set daemon_listen(value) {
        this._daemon_listen = value;
    }
    get daemon_sftp() {
        return this._daemon_sftp;
    }
    set daemon_sftp(value) {
        this._daemon_sftp = value;
    }
    get daemon_base() {
        return this._daemon_base;
    }
    set daemon_base(value) {
        this._daemon_base = value;
    }
    get created_at() {
        return this._created_at;
    }
    set created_at(value) {
        this._created_at = value;
    }
    get updated_at() {
        return this._updated_at;
    }
    set updated_at(value) {
        this._updated_at = value;
    }
}
