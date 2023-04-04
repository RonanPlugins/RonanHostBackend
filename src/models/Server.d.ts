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
    private _allocation;
    private _deploy;
    private _description;
    private _egg;
    private _environment;
    private _featureLimits;
    private _image;
    private _limits;
    private _name;
    private _outOfMemoryKiller;
    private _skipScripts;
    private _startWhenInstalled;
    private _startup;
    private _user;
    constructor(allocation: allocation, deploy: deploy, description: string, egg: number, environment: environment, featureLimits: featureLimits, image: string, limits: limits, name: string, outOfMemoryKiller: boolean, skipScripts: false, startWhenInstalled: false, startup: string, user: number);
    get allocation(): allocation;
    set allocation(value: allocation);
    get deploy(): deploy;
    set deploy(value: deploy);
    get description(): string;
    set description(value: string);
    get egg(): number;
    set egg(value: number);
    get environment(): environment;
    set environment(value: environment);
    get featureLimits(): featureLimits;
    set featureLimits(value: featureLimits);
    get image(): string;
    set image(value: string);
    get limits(): limits;
    set limits(value: limits);
    get name(): string;
    set name(value: string);
    get outOfMemoryKiller(): boolean;
    set outOfMemoryKiller(value: boolean);
    get skipScripts(): false;
    set skipScripts(value: false);
    get startWhenInstalled(): false;
    set startWhenInstalled(value: false);
    get startup(): string;
    set startup(value: string);
    get user(): number;
    set user(value: number);
}
export {};
