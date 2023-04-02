export declare type UUID = string & {
    __uuid: never;
};
export declare const newUUID: () => UUID;
export declare const validateUUID: (value: unknown) => value is UUID;
