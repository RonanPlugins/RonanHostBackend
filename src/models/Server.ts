interface deploy {
    dedicatedIp: boolean;
    portRange: string[];
    locations: number[];
}

interface allocation {
    additional: number[];
    default: number;
}

interface environment {
    [key: string]: string;
}
interface featureLimits {
    backups: number;
    databases: number;
    allocations: number;
}

interface limits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
}

export default class Server {
    private _allocation: allocation;
    private _deploy: deploy;
    private _description: string;
    private _egg: number;
    private _environment: environment;
    private _featureLimits: featureLimits;
    private _image: string;
    private _limits: limits;
    private _name: string;
    private _outOfMemoryKiller: boolean;
    private _skipScripts: false;
    private _startWhenInstalled: false;
    private _startup: string;
    private _user: number;


    constructor(allocation: allocation, deploy: deploy, description: string, egg: number, environment: environment, featureLimits: featureLimits, image: string, limits: limits, name: string, outOfMemoryKiller: boolean, skipScripts: false, startWhenInstalled: false, startup: string, user: number) {
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


    get allocation(): allocation {
        return this._allocation;
    }

    set allocation(value: allocation) {
        this._allocation = value;
    }

    get deploy(): deploy {
        return this._deploy;
    }

    set deploy(value: deploy) {
        this._deploy = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get egg(): number {
        return this._egg;
    }

    set egg(value: number) {
        this._egg = value;
    }

    get environment(): environment {
        return this._environment;
    }

    set environment(value: environment) {
        this._environment = value;
    }

    get featureLimits(): featureLimits {
        return this._featureLimits;
    }

    set featureLimits(value: featureLimits) {
        this._featureLimits = value;
    }

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

    get limits(): limits {
        return this._limits;
    }

    set limits(value: limits) {
        this._limits = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get outOfMemoryKiller(): boolean {
        return this._outOfMemoryKiller;
    }

    set outOfMemoryKiller(value: boolean) {
        this._outOfMemoryKiller = value;
    }

    get skipScripts(): false {
        return this._skipScripts;
    }

    set skipScripts(value: false) {
        this._skipScripts = value;
    }

    get startWhenInstalled(): false {
        return this._startWhenInstalled;
    }

    set startWhenInstalled(value: false) {
        this._startWhenInstalled = value;
    }

    get startup(): string {
        return this._startup;
    }

    set startup(value: string) {
        this._startup = value;
    }

    get user(): number {
        return this._user;
    }

    set user(value: number) {
        this._user = value;
    }
}