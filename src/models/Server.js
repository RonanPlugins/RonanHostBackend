export default class Server {
    constructor(allocation, deploy, description, egg, environment, featureLimits, image, limits, name, outOfMemoryKiller, skipScripts, startWhenInstalled, startup, user) {
        this._allocation = allocation;
        this._deploy = deploy;
        this._description = description;
        this._egg = egg;
        this._environment = environment;
        this._featureLimits = featureLimits;
        this._image = image;
        this._limits = limits;
        this._name = name;
        this._outOfMemoryKiller = outOfMemoryKiller;
        this._skipScripts = skipScripts;
        this._startWhenInstalled = startWhenInstalled;
        this._startup = startup;
        this._user = user;
    }
    get allocation() {
        return this._allocation;
    }
    set allocation(value) {
        this._allocation = value;
    }
    get deploy() {
        return this._deploy;
    }
    set deploy(value) {
        this._deploy = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get egg() {
        return this._egg;
    }
    set egg(value) {
        this._egg = value;
    }
    get environment() {
        return this._environment;
    }
    set environment(value) {
        this._environment = value;
    }
    get featureLimits() {
        return this._featureLimits;
    }
    set featureLimits(value) {
        this._featureLimits = value;
    }
    get image() {
        return this._image;
    }
    set image(value) {
        this._image = value;
    }
    get limits() {
        return this._limits;
    }
    set limits(value) {
        this._limits = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get outOfMemoryKiller() {
        return this._outOfMemoryKiller;
    }
    set outOfMemoryKiller(value) {
        this._outOfMemoryKiller = value;
    }
    get skipScripts() {
        return this._skipScripts;
    }
    set skipScripts(value) {
        this._skipScripts = value;
    }
    get startWhenInstalled() {
        return this._startWhenInstalled;
    }
    set startWhenInstalled(value) {
        this._startWhenInstalled = value;
    }
    get startup() {
        return this._startup;
    }
    set startup(value) {
        this._startup = value;
    }
    get user() {
        return this._user;
    }
    set user(value) {
        this._user = value;
    }
}
